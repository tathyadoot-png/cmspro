export const hasPermission = (user: any, permission: string) => {

  if (!user?.roles) return false;

  // Super Admin bypass
const isAdmin = user.roles.some(
 (role:any) => role?.name === "ADMIN" || role?.name === "SUPER_ADMIN"
);
  if (isAdmin) return true;

  return user.roles.some((role: any) =>
    role?.permissions?.some(
      (perm: any) => perm?.name === permission
    )
  );
};