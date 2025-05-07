import { queryClient } from '@/App';

export const queryManager = {
  invalidate: (key: readonly string[]) =>
    queryClient.invalidateQueries({
      queryKey: key,
    }),
  refetch: (key: readonly string[]) =>
    queryClient.refetchQueries({ queryKey: key }),

  remove: (key: readonly string[]) =>
    queryClient.removeQueries({ queryKey: key }),

  resetAll: () => queryClient.clear(),
};
