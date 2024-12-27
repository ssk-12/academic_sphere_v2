'use client'

import React, { useState, useEffect, useMemo, startTransition } from 'react';
import { Select, DatePicker, Table, Skeleton, message } from 'antd';
import { Button } from '@/components/ui/button';
import { useActionState } from 'react';
import { getClassesForUser, getEventsForClass, getStudentsForClass, updateAttendance, getAttendanceStatus } from '@/actions/attendanceActions';
import dayjs from 'dayjs';
import { toast } from '@/hooks/use-toast';

export default function AttendancePage({ userId }) {
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(dayjs());
  const [loading, setLoading] = useState({ classes: true, events: false, students: false });
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [loadingAttendance, setLoadingAttendance] = useState({}); // Track individual student loading states

  const initialState = {
    success: false,
    message: '',
  };

  // Use the custom hook for form state handling
  const [state, formAction, isLoading] = useActionState(updateAttendance, initialState);

  useEffect(() => {
    const fetchClasses = async () => {
      const fetchedClasses = await getClassesForUser(userId);
      setClasses(fetchedClasses);
      setLoading(prev => ({ ...prev, classes: false }));
    };
    fetchClasses();
  }, [userId]);

  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      if (selectedEvent && attendanceDate) {
        setLoading(prev => ({ ...prev, students: true }));
        const status = await getAttendanceStatus(selectedEvent, attendanceDate.toDate());
        setAttendanceStatus(status);
        setLoading(prev => ({ ...prev, students: false }));
      }
    };
    fetchAttendanceStatus();
  }, [selectedEvent, attendanceDate]);

  useEffect(() => {
    if (state.success) {
      toast({
        title: state.success ? 'Success' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state]);

  const handleClassChange = async (value) => {
    setSelectedClass(value);
    setSelectedEvent(null);
    setStudents([]);
    setLoading(prev => ({ ...prev, events: true }));
    const fetchedEvents = await getEventsForClass(value);
    setEvents(fetchedEvents);
    setLoading(prev => ({ ...prev, events: false }));
  };

  const handleEventChange = async (value) => {
    setSelectedEvent(value);
    setLoading(prev => ({ ...prev, students: true }));
    const fetchedStudents = await getStudentsForClass(selectedClass);
    setStudents(fetchedStudents);
    setLoading(prev => ({ ...prev, students: false }));
  };

  const handleDateChange = (date) => {
    setAttendanceDate(date);
  };

  const handleAttendanceChange = (studentId, present) => {
    const formData = new FormData();
    formData.append('eventId', selectedEvent);
    formData.append('studentId', studentId);
    formData.append('present', present.toString());
    formData.append('date', attendanceDate.toDate().toISOString());

    // Set the loading state for this student
    setLoadingAttendance((prev) => ({ ...prev, [studentId]: true }));

    startTransition(() => {
      formAction(formData);
    });

    // Optimistically update the UI
    setAttendanceStatus(prev => ({ ...prev, [studentId]: present }));

    // After action completes, set loading state back to false
    setLoadingAttendance((prev) => ({ ...prev, [studentId]: false }));
  };

  const columns = useMemo(() => [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Attendance',
      key: 'attendance',
      render: (_, record) => (
        <div className='flex gap-2 justify-start items-center'>
          <Button
            onClick={() => handleAttendanceChange(record.id, true)}
            style={{
              backgroundColor: attendanceStatus[record.id] === true ? 'green' : undefined,
              color: attendanceStatus[record.id] === true ? 'white' : undefined
            }}
            // loading={loadingAttendance[record.id]} // Show loading for this specific student
          >
            {loadingAttendance[record.id] ? 'Marking...' : 'Present'}
          </Button>
          <Button
            onClick={() => handleAttendanceChange(record.id, false)}
            style={{
              backgroundColor: attendanceStatus[record.id] === false ? 'red' : undefined,
              color: attendanceStatus[record.id] === false ? 'white' : undefined
            }}
            // loading={loadingAttendance[record.id]} // Show loading for this specific student
          >
            {loadingAttendance[record.id] ? 'Marking...' : 'Absent'}
          </Button>
        </div>
      ),
    },
  ], [attendanceStatus, loadingAttendance]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Attendance</h1>

      <div className="mb-4">
        <label className="block mb-2">Select Date:</label>
        <DatePicker
          onChange={handleDateChange}
          defaultValue={attendanceDate}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Select Class:</label>
        {loading.classes ? (
          <Skeleton.Input style={{ width: '100%' }} active />
        ) : (
          <Select
            style={{ width: '100%' }}
            placeholder="Select a class"
            onChange={handleClassChange}
            options={classes}
          />
        )}
      </div>

      {selectedClass && (
        <div className="mb-4">
          <label className="block mb-2">Select Event:</label>
          {loading.events ? (
            <Skeleton.Input style={{ width: '100%' }} active />
          ) : (
            <Select
              style={{ width: '100%' }}
              placeholder="Select an event"
              onChange={handleEventChange}
              options={events}
            />
          )}
        </div>
      )}

      {selectedEvent && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Students</h2>
          {loading.students ? (
            <Skeleton active />
          ) : (
            <Table
              columns={columns}
              dataSource={students}
              rowKey="id"
              rowClassName={(record) => {
                if (attendanceStatus[record.id] === true) return 'bg-green-100';
                if (attendanceStatus[record.id] === false) return 'bg-red-100';
                return '';
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
