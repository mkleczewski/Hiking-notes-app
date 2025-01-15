'use client';
import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteBook, verifyEntry } from '@/lib/actions/admin/book';
import { deletePlace } from '@/lib/actions/admin/places';
import { deleteRegion } from '@/lib/actions/admin/regions';
import { deleteRoute } from '@/lib/actions/admin/routes';
import { deleteSubregion } from '@/lib/actions/admin/subregions';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export function CreateSubregion() {
  return (
    <Link
      href="/crud/subregions/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Stwórz podregion</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateSubregion({ id }: { id: string }) {
  return (
    <Link
      href={`/crud/subregions/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteSubregion({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSubregion(id);
      toast.success('Subregion deleted successfully');
    } catch (error) {
      toast.error(`Failed to delete subregion ${error}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="rounded-md border bg-red-500 p-2 hover:bg-red-600">
            <span className="sr-only">Delete</span>
            <TrashIcon className="w-5 text-white" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Jesteś pewien, że chcesz usunąć ten podregion?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tego nie można cofnąć. Zostanie to usunięte na zawsze.
              subregion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Wróć</AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 ${
                  isDeleting ? 'opacity-50' : ''
                }`}
              >
                {isDeleting ? 'Usuwanie...' : 'Usuń'}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// regiony

export function CreateRegion() {
  return (
    <Link
      href="/crud/regions/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Stwórz Region</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateRegion({ id }: { id: string }) {
  return (
    <Link
      href={`/crud/regions/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteRegion({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRegion(id);
      toast.success('Region deleted successfully');
    } catch (error) {
      toast.error(`Failed to delete region ${error}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="rounded-md border bg-red-500 p-2 hover:bg-red-600">
            <span className="sr-only">Delete</span>
            <TrashIcon className="w-5 text-white" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
            Jesteś pewien, że chcesz usunąć ten region?
            </AlertDialogTitle>
            <AlertDialogDescription>
            Tego nie można cofnąć. Zostanie to usunięte na zawsze.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 ${
                  isDeleting ? 'opacity-50' : ''
                }`}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// punkty

export function CreatePlace() {
  return (
    <Link
      href="/crud/places/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Place</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdatePlace({ id }: { id: string }) {
  return (
    <Link
      href={`/crud/places/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeletePlace({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePlace(id);
      toast.success('Place deleted successfully');
    } catch (error) {
      toast.error(`Failed to delete place ${error}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="rounded-md border bg-red-500 p-2 hover:bg-red-600">
            <span className="sr-only">Delete</span>
            <TrashIcon className="w-5 text-white" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure you want to delete this place?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              place.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 ${
                  isDeleting ? 'opacity-50' : ''
                }`}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// szlaki

export function CreateRoute() {
  return (
    <Link
      href="/crud/routes/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Utwórz szlak</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateRoute({ id }: { id: string }) {
  return (
    <Link
      href={`/crud/routes/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteRoute({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRoute(id);
      toast.success('Route deleted successfully');
    } catch (error) {
      toast.error(`Failed to delete route ${error}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="rounded-md border bg-red-500 p-2 hover:bg-red-600">
            <span className="sr-only">Delete</span>
            <TrashIcon className="w-5 text-white" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure you want to delete this route?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              route.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 ${
                  isDeleting ? 'opacity-50' : ''
                }`}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function UpdateBook({ id }: { id: string }) {
  return (
    <Link
      href={`/ksiazeczka/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function VerifyEntry({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await verifyEntry(id);
      toast.success('Record verified successfully');
    } catch (error) {
      toast.error(`Failed to verify record ${error}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="rounded-md border bg-green-500 p-2 hover:bg-green-600">
            <span className="sr-only">Add</span>
            <CheckIcon className="w-5 text-white" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure you want to add this trip for achievement?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will confirm this entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 ${
                  isDeleting ? 'opacity-50' : ''
                }`}
              >
                {isDeleting ? 'Adding...' : 'Add'}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function DeleteRecordFromBook({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBook(id);
      toast.success('Record deleted successfully');
    } catch (error) {
      toast.error(`Failed to delete record ${error}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="rounded-md border bg-red-500 p-2 hover:bg-red-600">
            <span className="sr-only">Delete</span>
            <TrashIcon className="w-5 text-white" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure you want to delete this subregion?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              subregion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 ${
                  isDeleting ? 'opacity-50' : ''
                }`}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
