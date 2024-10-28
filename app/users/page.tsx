"use client"
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const GET_USERS = gql`
  query GetUsers {
    users {
      data {
        id
        name
        email
        phone
      }
    }
  }
`;

const users = () => {

    const { data, loading, error } = useQuery(GET_USERS);

    if (loading) {
        return <div>loading.....</div>;
    }
    if (error) return <p>Error: {error.message}</p>;
    if (data) {
        console.log("data", data);
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 justify-between items-center">
            {data.users.data.map((user: any) => (
                <Card key={user.id}>
                    <CardHeader>
                        <CardTitle>{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Phone: {user.phone}</p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline">
                            <Link href={`/users/${user.id}`}>
                                View Details
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>)
}

export default users



