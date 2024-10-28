"use client";

import { gql, useQuery } from "@apollo/client";
import { use } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link";




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

const AlbumDetails = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);

    const { data, loading, error } = useQuery(GET_ALBUM_BY_ID, {
        variables: { id },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const { album } = data;

    return (
        <div className="ml-4">
            <Button className="mb-4" variant="outline">
                <Link href={"/albums"}>
                    Back
                </Link>
            </Button>
            <Card >
                <CardHeader>
                    <CardTitle>Album Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <h1>{album.title}</h1>
                    <h1>{album.id}</h1>
                    <p>Album Owner: {album.user.name}</p>
                    <h2>Photos</h2>
                    <ul>
                        {album.photos.data.map((photo: any) => (
                            <li key={photo.id}>
                                <h3>{photo.title}</h3>
                                <img loading="lazy" src={photo.thumbnailUrl} alt={photo.title} />
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>

    );
};

export default AlbumDetails;
