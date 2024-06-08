export type User = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
};

export type UserAPIResponse = {
  users: any;
  data: Array<User>;
  meta: {
    totalRowCount: number;
  };
};
