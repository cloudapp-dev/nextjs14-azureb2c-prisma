import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Button,
  Text,
} from "@tremor/react";

interface User {
  id: number;
  logins: number;
  email: string;
  _sum: { logins: number };
}

export default function LoginUsersTableGroup({
  loginusersgroup,
}: {
  loginusersgroup: User[];
}) {
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Logins</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loginusersgroup.map((user: User, index: number) => (
            <TableRow key={index}>
              <TableCell>
                <Text>{user.email}</Text>
              </TableCell>
              <TableCell>
                <Text>{user._sum.logins}</Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
