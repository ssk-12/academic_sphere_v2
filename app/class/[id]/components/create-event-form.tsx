// 'use client'

// import { useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import * as z from 'zod'
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Button } from "@/components/ui/button"

// const formSchema = z.object({
//   name: z.string().min(1, 'Name is required'),
//   description: z.string().optional(),
//   isLocationBased: z.boolean(),
//   proximity: z.number().min(0).optional(),
// })

// type FormData = z.infer<typeof formSchema>

// export function CreateEventForm({ dispatch, isPending, onSuccess }: { dispatch: any, isPending: boolean, onSuccess: () => void }) {
//   const [isLocationBased, setIsLocationBased] = useState(false)
//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: '',
//       description: '',
//       isLocationBased: false,
//       proximity: undefined,
//     },
//   })

//   const onSubmit = async (data: FormData) => {
//     let locationData = {}
//     if (data.isLocationBased) {
//       const position = await getCurrentPosition()
//       locationData = {
//         locationLat: position.coords.latitude,
//         locationLng: position.coords.longitude,
//       }
//     }

//     const result = await dispatch({
//       ...data,
//       ...locationData,
//     })

//     if (result.success) {
//       onSuccess()
//       form.reset()
//     }
//   }

//   const getCurrentPosition = (): Promise<GeolocationPosition> => {
//     return new Promise((resolve, reject) => {
//       navigator.geolocation.getCurrentPosition(resolve, reject)
//     })
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Name</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <Textarea {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="isLocationBased"
//           render={({ field }) => (
//             <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
//               <div className="space-y-0.5">
//                 <FormLabel className="text-base">Location Based</FormLabel>
//                 <FormDescription>
//                   Enable to use your current location for the event.
//                 </FormDescription>
//               </div>
//               <FormControl>
//                 <Switch
//                   checked={field.value}
//                   onCheckedChange={(checked) => {
//                     field.onChange(checked)
//                     setIsLocationBased(checked)
//                   }}
//                 />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         {isLocationBased && (
//           <FormField
//             control={form.control}
//             name="proximity"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Proximity (meters)</FormLabel>
//                 <FormControl>
//                   <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         )}
//         <Button type="submit" disabled={isPending}>
//           {isPending ? 'Creating...' : 'Create Event'}
//         </Button>
//       </form>
//     </Form>
//   )
// }

