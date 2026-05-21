import { createPropertySelectors, createSelector } from '@ngxs/store';
import { AUTH_STORE } from './auth/auth.store';
import z from 'zod';

const authSlices = createPropertySelectors(AUTH_STORE);

export const principal = createSelector([authSlices.principal], (principal) => {
  const schema = z.object({
    initials: z.string(),
    fullName: z.string(),
    photo: z.string().nullish().default(null),
  });
  return schema.parse(principal);
});
