"use client"

import { useQuery, gql } from '@apollo/client';
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from 'next/navigation'


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

export default function AlbumsPage() {
  const router = useRouter();

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


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
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
      header: "Title",
      cell: ({ row }) => (
        <button className='cursor-pointer' onClick={() => router.push(`/albums/${row.original.id}`)}>
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
        <Button>
          Delete Selected
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data.albums.data}
      />
    </div>
  );
}