"use client"

import { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { ArrowUpDown } from "lucide-react"

const GET_ALBUMS = gql`
  query GetAlbums($options: PageQueryOptions) {
    albums(options: $options) {
      data {
        id
        title
        user {
          name
        }
      }
      meta {
        totalCount
      }
    }
  }
`;

const ADD_ALBUM = gql`
  mutation AddAlbum($input: CreateAlbumInput!) {
    createAlbum(input: $input) {
      id
      title
      user {
        name
      }
    }
  }
`;

const DELETE_ALBUMS = gql`
  mutation DeleteAlbums($id: ID!) {
    deleteAlbum(id: $id)
  }
`;

export default function AlbumsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ title: "", userId: "" });
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);

  const { loading, error, data, refetch } = useQuery(GET_ALBUMS, {
    variables: {
      options: {
        sort: {
          field: "title",
          order: "ASC"
        }
      }
    }
  });

  const [addAlbum, { loading: addLoading }] = useMutation(ADD_ALBUM, {
    onCompleted: () => {
      setIsOpen(false);
      refetch();
      toast({
        title: "Success",
        description: "New album added successfully!",
      });
      setNewAlbum({ title: "", userId: "" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [deleteAlbums, { loading: deleteLoading }] = useMutation(DELETE_ALBUMS, {
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAlbum({ ...newAlbum, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAlbum({ variables: { input: newAlbum } });
  };


  const handleBulkDelete = async () => {
    if (selectedAlbums.length === 0) {
      toast({
        title: "Warning",
        description: "No albums selected for deletion.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Loop through each selected album ID and call the deleteAlbum mutation
      for (const id of selectedAlbums) {
        await deleteAlbums({ variables: { id } });
      }
      toast({
        title: "Success",
        description: `${selectedAlbums.length} album(s) deleted successfully!`,
      });
      setSelectedAlbums([]);
      refetch();
    } catch (error) {
      console.error(error)
    }
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <button className='cursor-pointer h-[30px]' onClick={() => router.push(`/albums/${row.original.id}`)}>
          {row.getValue('title')}
        </button>
      ),
    },
    {
      accessorKey: "user.name",
      header: "User",
    },
  ]

  return (
    <div className='p-4'>
      <div className="flex justify-between mb-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add new album</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Album</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={newAlbum.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  name="userId"
                  type="number"
                  value={newAlbum.userId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit" disabled={addLoading}>
                {addLoading ? "Adding..." : "Add Album"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        <Button variant={'destructive'} onClick={handleBulkDelete} disabled={deleteLoading || selectedAlbums.length === 0}>
          {deleteLoading ? "Deleting..." : "Delete Selected"}
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data.albums.data}
        onRowSelectionChange={setSelectedAlbums}
      />
    </div>
  );
}