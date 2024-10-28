"use client";

import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { use } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Image from "next/image";

const GET_ALBUM_BY_ID = gql`
  query GetAlbumById($id: ID!) {
    album(id: $id) {
      id
      title
      user {
        id
        name
      }
      photos {
        data {
          id
          title
          url
          thumbnailUrl
        }
      }
    }
  }
`;

const UPDATE_ALBUM = gql`
  mutation UpdateAlbum($id: ID!, $input: UpdateAlbumInput!) {
    updateAlbum(id: $id, input: $input) {
      id
      title
    }
  }
`;

const DELETE_ALBUM = gql`
  mutation DeleteAlbum($id: ID!) {
    deleteAlbum(id: $id)
  }
`;

const AlbumDetails = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const router = useRouter();
    const { toast } = useToast();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editedAlbum, setEditedAlbum] = useState({
        title: ""
    });

    const { data, loading, error, refetch } = useQuery(GET_ALBUM_BY_ID, {
        variables: { id },
    });

    const [imgError, setImgError] = useState<{[key: string]: boolean}>({});

    const [updateAlbum] = useMutation(UPDATE_ALBUM, {
        onCompleted: () => {
            setIsEditOpen(false);
            refetch();
            toast({
                title: "Success",
                description: "Album updated successfully!",
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

    const [deleteAlbum] = useMutation(DELETE_ALBUM, {
        onCompleted: () => {
            toast({
                title: "Success",
                description: "Album deleted successfully!",
            });
            router.push('/albums');
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const { album } = data;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedAlbum({ ...editedAlbum, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateAlbum({ variables: { id, input: editedAlbum } });
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this album?")) {
            deleteAlbum({ variables: { id } });
        }
    };

    const handleImageError = (photoId: string) => {
        setImgError(prev => ({ ...prev, [photoId]: true }));
    };

    return (
        <div className="p-4">
            <Button className="mb-4" variant="outline" asChild>
                <Link href="/albums">
                    Back
                </Link>
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle>Album Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <h1 className="text-2xl font-bold mb-2">{album.title}</h1>
                    <p className="mb-4">Album Owner: {album.user.name}</p>
                    <div className="flex space-x-2 mb-6">
                        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => setEditedAlbum({
                                    title: album.title
                                })}>
                                    Edit Album
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Album</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={editedAlbum.title}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <Button type="submit">Update Album</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Button variant="destructive" onClick={handleDelete}>Delete Album</Button>
                    </div>
                    <h2 className="text-xl font-semibold mb-4">Photos</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {album.photos.data.map((photo: any) => (
                            <div key={photo.id} className="relative group">
                                <Image
                                    src={imgError[photo.id] ? '/placeholder.png' : photo.thumbnailUrl}
                                    alt={photo.title}
                                    priority
                                    width={150}
                                    height={150}
                                    className="w-full h-auto object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                                    onError={() => handleImageError(photo.id)}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <p className="text-white text-sm text-center p-2">{photo.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AlbumDetails;