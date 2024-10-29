"use client"

import { useState } from "react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "lucide-react"

import { useQuery, useMutation } from "@apollo/client";
import { User } from "@/lib/types";
import { ADD_USER, GET_USERS } from "@/lib/gqlOperations";

const Users = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [newUser, setNewUser] = useState<User>({ name: "", username: "", email: "", phone: "" })
    const { toast } = useToast()

    const { data, loading, error, refetch } = useQuery(GET_USERS);

    const [addUser, { loading: addLoading }] = useMutation(ADD_USER, {
        onCompleted: () => {
            setIsOpen(false);
            toast({
                title: "Success",
                description: "New user added successfully!",
            });
            refetch();
            setNewUser({ name: "", username: "", email: "", phone: "" });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addUser({ variables: { input: newUser } });
    };

    if (loading) {
         return (
          <div className="flex justify-center items-center h-screen w-full">
            <Loader className="animate-spin" />
          </div>
        );
    }
    if (error) return <p className="text-red-500">Error: {error.message}</p>;

    return (
        <div className="p-4">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button className="mb-4">Add new user</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={newUser.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={newUser.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={newUser.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={newUser.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={addLoading}>
                            {addLoading ? "Adding..." : "Add User"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.users.data.map((user: User) => (
                    <Card key={user.id}>
                        <CardHeader>
                            <CardTitle>{user.name}</CardTitle>
                            <CardDescription>{user.username}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Email: {user.email}</p>
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
            </div>
        </div>
    )
}

export default Users;