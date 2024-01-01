import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GraveType } from "../interfaces/GraveTypeInterfaces";
import axios from "axios";

// CREATE hook (post a new row to api)
export const useCreateRow = (queryKey: string, path: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (row: any) => {
      //send api update request here
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(path, { ...row }, config);
      return response.data;
    },
    //client side optimistic update
    onSuccess: (newRowInfo: any) => {
      queryClient.setQueryData(
        [queryKey],
        (prevRows: any) => [...prevRows, { ...newRowInfo }] as any[]
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: [graveTypeQueryKey] }), //refetch users after mutation, disabled for demo
  });
};

// READ hook (get rows from api)
export const useGetRows = (queryKey: string, path: string) => {
  return useQuery<any[]>({
    queryKey: [queryKey],
    queryFn: async () => {
      // send api request here
      const response = await axios.get(path);
      return response.data;
    },
    refetchOnWindowFocus: true,
  });
};

// UPDATE hook (put a row in api)
export const useUpdateRow = (queryKey: string, path: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (row: any) => {
      //send api update request here
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.put(path, { ...row }, config);
      console.log('++++++++++++++++++++++++++++');
      console.log(response.data);
      return response.data;
    },
    //client side optimistic update
    onMutate: (newRowInfo: any) => {
      console.log('+ newRowInfo +');
      console.log(newRowInfo);
      queryClient.setQueryData([queryKey], (prevRows: any) =>
        prevRows?.map((row: any) =>
          row._id === newRowInfo._id ? newRowInfo : row
        )
      );
    },
    // onSettled: () => queryClient.refetchQueries({ queryKey: [queryKey] }), //refetch users after mutation, disabled for demo
  });
};

// DELETE hook (delete a row in api)
export const useDeleteRow = (queryKey: string, path: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      //send api update request here
      const response = await axios.delete(`${path}/${id}`);
      return response.data;
    },
    // client side optimistic update
    onMutate: (id: string) => {
      queryClient.setQueryData([queryKey], (prevRows: any) =>
        prevRows?.filter((row: any) => row._id !== id)
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users-all'] }), //refetch users after mutation, disabled for demo
  });
};
