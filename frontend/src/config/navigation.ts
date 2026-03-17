export const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    permission: "USER_VIEW",
  },

  // {
  //   label: "Create Task",
  //   path: "/dashboard/tasks/create",
  //   permission: "TASK_CREATE",
  // },
  {
    label: "Clients",
    path: "/dashboard/clients",
    permission: "CLIENT_VIEW",
  },
  // {
  //   label: "Projects",
  //   path: "/dashboard/projects",
  //   permission: "PROJECT_VIEW",
  // },

  // 🔥 ADD THIS
{
  label: "Workshops",
  path: "/dashboard/workshops",
  permission: "WORKSHOP_VIEW",
},
  {
    label: "Users",
    path: "/dashboard/users",
    permission: "USER_VIEW",
  },
  {
    label: "Roles",
    path: "/dashboard/roles",
    permission: "ROLE_VIEW",
  },
  {
    label: "Analytics",
    path: "/dashboard/analytics",
    permission: "USER_VIEW",
  },
  {
  label: "Team Dashboard",
  path: "/dashboard/team",
  permission: "TASK_VIEW" // ya jo use kar rahe ho
}
];