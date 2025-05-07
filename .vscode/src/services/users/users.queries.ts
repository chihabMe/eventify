// user.queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryClient } from '@/App';
import * as api from './users.api';

const queryKeys = {
  all: ['users'] as const,
  single: (id: string) => [...queryKeys.all, id] as const,
};

export const useUsers = () =>
  useQuery({ queryKey: queryKeys.all, queryFn: api.fetchUsers });

export const useUser = (id: string) =>
  useQuery({
    queryKey: queryKeys.single(id),
    queryFn: () => api.fetchUser(id),
    enabled: !!id,
  });

export const useCreateUser = () => {
  return useMutation({
    mutationFn: api.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateUser(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.single(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
};
