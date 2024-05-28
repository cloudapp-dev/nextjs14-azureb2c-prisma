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
  name: string;
  logins: number;
  email: string;
  lastLogin: Date;
}

export default function LoginUsersTable({
  loginusers,
}: {
  loginusers: User[];
}) {
  let intlDateObj = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "full",
    timeStyle: "long",
    timeZone: "Europe/Paris",
  });

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Logins</TableHeaderCell>
            <TableHeaderCell>LastLogin</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loginusers.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                <Text>{user.email}</Text>
              </TableCell>
              <TableCell>
                <Text>{user.logins}</Text>
              </TableCell>
              <TableCell>
                <Text>{intlDateObj.format(user.lastLogin)}</Text>
              </TableCell>
              {/* <TableCell>
              <Badge color={colors[item.status]} size="xs">
                {item.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{item.amount}</TableCell> */}
              {/* <TableCell>
                <Button
                  size="xs"
                  variant="primary"
                  color="gray"
                  onClick={() => ondelete(user.id)}
                >
                  Delete
                </Button>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
