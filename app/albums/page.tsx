"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx';

import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { ArrowUpDown, File } from "lucide-react"

import { useQuery, useMutation } from '@apollo/client';
import { Album } from '@/lib/types';
import { ADD_ALBUM, DELETE_ALBUMS, GET_ALBUMS } from '@/lib/gqlOperations';

export default function AlbumsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [newAlbum, setNewAlbum] = useState<Album>({ title: "", userId: "" });
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);
  const [importedAlbums, setImportedAlbums] = useState<Album[]>([]);

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

  const newAlbumHandler = (e: React.FormEvent) => {
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Album[];
        setImportedAlbums(jsonData);
        setIsImportOpen(true);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleImportedInputChange = (index: number, field: keyof Album, value: string) => {
    const updatedAlbums = [...importedAlbums];
    updatedAlbums[index] = { ...updatedAlbums[index], [field]: value };
    setImportedAlbums(updatedAlbums);
  };

  const handleRemoveImported = (index: number) => {
    const updatedAlbums = importedAlbums.filter((_, i) => i !== index);
    setImportedAlbums(updatedAlbums);
  };

  const handleImport = async () => {
    try {
      for (const album of importedAlbums) {
        await addAlbum({ variables: { input: album } });
      }
      toast({
        title: "Success",
        description: `${importedAlbums.length} album(s) imported successfully!`,
      });
      setImportedAlbums([]);
      setIsImportOpen(false);
      refetch();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to import albums. Please try again.",
        variant: "destructive",
      });
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
        <div>

          {/* create new album dialog */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>Add new album</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Album</DialogTitle>
              </DialogHeader>
              <form onSubmit={newAlbumHandler} className="space-y-4">
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
          <div className=' mt-4 '>
            <p className='text-sm text-gray-500'>Or import albums from a CSV/XLSX file</p>
            <div className='flex gap-2 items-center justify-center'>
              <File />
              <Input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileUpload}
                className="max-w-xsborder-2"
              />
            </div>
          </div>
        </div>
        <Button variant={'destructive'} onClick={handleBulkDelete} disabled={deleteLoading || selectedAlbums.length === 0}>
          {deleteLoading ? "Deleting..." : "Delete Selected"}
        </Button>
      </div>

      {/* data table */}
      <DataTable
        columns={columns}
        data={data.albums.data}
        onRowSelectionChange={setSelectedAlbums}
      />

      {/* album upload dialog  */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Import Albums</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>User ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {importedAlbums.map((album, index) => (
                  <tr key={index}>
                    <td>
                      <Input
                        value={album.title}
                        onChange={(e) => handleImportedInputChange(index, 'title', e.target.value)}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={album.userId}
                        onChange={(e) => handleImportedInputChange(index, 'userId', e.target.value)}
                      />
                    </td>
                    <td>
                      <Button variant="destructive" className='ml-16' onClick={() => handleRemoveImported(index)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button onClick={handleImport} disabled={importedAlbums.length === 0}>
            Import Albums
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}