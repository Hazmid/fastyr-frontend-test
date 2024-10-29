"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "lucide-react"

import { useQuery, useMutation } from "@apollo/client";
import { User } from "@/lib/types";
import { DELETE_USER, GET_USER_BY_ID, UPDATE_USER } from "@/lib/gqlOperations";

const UserDetails = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const router = useRouter();
    const { toast } = useToast();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editedUser, setEditedUser] = useState<User>({
        name: "",
        username: "",
        email: "",
        phone: ""
    });

    const { data, loading, error, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id },
    });

    const [updateUser] = useMutation(UPDATE_USER, {
        onCompleted: () => {
            setIsEditOpen(false);
            refetch();
            toast({
                title: "Success",
                description: "User updated successfully!",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const [deleteUser] = useMutation(DELETE_USER, {
        onCompleted: () => {
            toast({
                title: "Success",
                description: "User deleted successfully!",
            });
            router.push('/users');
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    if (loading) {
        return (
         <div className="flex justify-center items-center h-screen w-full">
           <Loader className="animate-spin" />
         </div>
       );
   }    
   if (error) return <p>Error: {error.message}</p>;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser({ variables: { id, input: editedUser } });
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteUser({ variables: { id } });
        }
    };

    return (
        <div className="p-4">
            <Button className="mb-4" variant="outline" asChild>
                <Link href="/users">
                    Back
                </Link>
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <h1 className="text-2xl font-bold mb-2">Name: {data.user.name}</h1>
                    <p className="mb-1">Email: {data.user.email}</p>
                    <p className="mb-1">Username: {data.user.username}</p>
                    <p className="mb-1">Phone: {data.user.phone}</p>
                    <p className="mb-1">Address: {data.user.address.street}, {data.user.address.city}, {data.user.address.zipcode}</p>
                    <p className="mb-4">Company: {data.user.company.name}</p>
                    <div className="flex space-x-2">
                        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => setEditedUser({
                                    name: data.user.name,
                                    username: data.user.username,
                                    email: data.user.email,
                                    phone: data.user.phone
                                })}>
                                    Edit User
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit User</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={editedUser.name}
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
                                            value={editedUser.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            name="username"
                                            value={editedUser.username}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={editedUser.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <Button type="submit">Update User</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Button variant="destructive" onClick={handleDelete}>Delete User</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserDetails;