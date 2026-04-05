import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import * as React from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'

export type TableWrapperText = {
    title: string,
    btnName:string,
    description?:string,
    btnUrl:string
  }

interface TableWrapperProps {
  wrapperText: TableWrapperText,
  onAddOrganization?: () => void
  onSearch?: (query: string) => void
  Table?: React.ReactNode
}

export function TableWrapper({
  wrapperText,
  onAddOrganization,
  onSearch,
  Table,
}: TableWrapperProps) {

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [searchQuery, setSearchQuery] = React.useState(
    searchParams.get('search') ?? ''
  )

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)

    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }

    navigate(`?${params.toString()}`, { replace: true })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {wrapperText.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Add button */}
          <Link to={wrapperText.btnUrl}>
          <Button
            variant={"default"}
            onClick={onAddOrganization}
          >
            {/* <Plus className="h-4 w-4" /> */}
            {wrapperText.btnName}
          </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      {Table}
    </div>
  )
}
