import { useMutation, useQuery } from '@tanstack/react-query';
import * as api from './auth.api';
import { queryManager } from '../query.manager';

export const authQueryKeys = {
  profile: ['profile'] as const,
};
export const useProfileQuery = () =>
  useQuery({
    queryKey: authQueryKeys.profile,
    queryFn: api.fetchProfile,
    retry: 1,
    staleTime: 1000 * 10,
  });

export const useLogoutMutation = () =>
  useMutation({
    mutationFn: api.logoutUser,
    onSuccess: () => {
      queryManager.invalidate(authQueryKeys.profile);
    },
  });
