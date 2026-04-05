import * as React from 'react'
import { ChevronLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'

export type FormWrapperText = {
    title: string,
    btnName:string,
    description?:string,
  }

interface OrganizationsWrapperProps {
  wrapperText: FormWrapperText | null,
  onAddOrganization?: () => void
  children?: React.ReactNode
}

export function FormWrapper({
  wrapperText,
  onAddOrganization,
  children,
}: OrganizationsWrapperProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-5">
        <ChevronLeft onClick={() => navigate(-1)}/>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {wrapperText?.title}
            </h1>
            <p>
              {wrapperText?.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Add button */}
          <Button
            variant={"default"}
            onClick={onAddOrganization}
          >
            <Plus className="h-4 w-4" />
            {wrapperText?.btnName}
          </Button>
        </div>
      </div>

      {/* Table */}
      {children}
    </div>
  )
}
