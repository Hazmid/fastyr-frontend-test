"use client";

import { gql, useQuery } from "@apollo/client";
import { use } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link";


const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      name
      email
      phone
      address {
        street
        city
        zipcode
      }
      company {
        name
      }
    }
  }
`;

const UserDetails = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);

    const { data, loading, error } = useQuery(GET_USER_BY_ID, {
        variables: { id },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="ml-4">
            <Button className="mb-4" variant="outline">
                <Link href={"/users"}>
                    Back
                </Link>
            </Button>
            <Card >
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <h1>Name: {data.user.name}</h1>
                    <p>Email: {data.user.email}</p>
                    <p>Phone: {data.user.phone}</p>
                    <p>Address: {data.user.address.street}, {data.user.address.city}, {data.user.address.zipcode}</p>
                    <p>Company: {data.user.company.name}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserDetails;
