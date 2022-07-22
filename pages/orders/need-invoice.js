import Layout from '../../components/layout'
import React from 'react';
import { useTable, useFilters, useGlobalFilter, usePagination, useSortBy } from "react-table";

// const apiEndpoint = "https://strapi-iteh.onrender.com/api/orders?[populate]=*&pagination[pageSize]=50&sort=id%3Adesc&filters[Archived][$eq]=true";
const apiEndpoint = "http://localhost:1337/api/order/line-items-without-invoices";

export async function getServerSideProps() {
    const res = await fetch(apiEndpoint);
    const data = await res.json();

    const sortedData = data.data.map((order) => {
        order.attributes.createdAt = new Date(order.attributes.createdAt).toLocaleString('default', { month: 'short', year: 'numeric'} );
        return order;
    });

    return {
        props: { sortedData } ,
    };
}

function DefaultColumnFilter({
                                 column: { filterValue, preFilteredRows, setFilter },
                             }) {
    const count = preFilteredRows.length

    return (
        <input
            className="input input-bordered input-sm w-full max-w-fit"
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}

function SelectColumnFilter({
                                column: { filterValue, setFilter, preFilteredRows, id },
                            }) {
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    return (
        <select
            className="select select-bordered w-full select-sm max-w-xs"
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">All</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}

function cleanString(string) {
    let cleanString = "";

    cleanString = string.replace("_", " ");
    cleanString = cleanString.charAt(0).toUpperCase() + cleanString.slice(1);

    return cleanString;
}


const LineItemsWithoutInvoices = ({ sortedData }) => {
    let colData = [];

    sortedData.forEach(element => {
        element.attributes.line_items.forEach(lineItem => {
            colData.push({
                col1: element.attributes.order_id,
                col2: element.attributes.advertiser.data.attributes.advertiser_name,
                col3: cleanString(element.attributes.status),
            });
        });

        console.info(colData);
    });

    const sortees = React.useMemo(
        () => [
            {
                id: "sorted",
                desc: true
            }
        ],
        []
    );

    const data = React.useMemo(() => colData, []);

    const columns = React.useMemo(
        () => [
            {
                id: 'expander',
                Header: () => null,
                Cell: ({ row }) =>
                    <span
                        {...row.getToggleRowExpandedProps({
                            style: { paddingLeft: `${row.depth * 2}rem`, },
                        })}
                    >
                        {row.isExpanded ? '-' : '+'}
                    </span>
            },
            {
                Header: 'Order #',
                accessor: 'col1',
                id: "sorted",
            },
            {
                Header: 'Advertiser',
                accessor: 'col2',
            },
            {
                Header: 'Inventory',
                accessor: 'col5',
                disableFilters: true,
            },
            {
                Header: 'Paid',
                accessor: 'col3',
                Filter: SelectColumnFilter,
                filter: 'includes'
            },
            {
                Header: 'Status',
                accessor: 'col4',
                Filter: SelectColumnFilter,
                filter: 'includes'
            },
        ],
        []
    )

    const defaultColumn = React.useMemo(
        () => ({
            Filter: DefaultColumnFilter,
        }),
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        pageOptions,
        pageCount,
        state: { pageIndex, pageSize },
        gotoPage,
        previousPage,
        nextPage,
        setPageSize,
        canPreviousPage,
        canNextPage,
        visibleColumns,
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            initialState: { pageIndex: 0, sortBy: sortees, pageSize: 30 },
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        useExpanded,
        usePagination,
    )

    return (
        <Layout>
            <h1 className="text-center text-xl">Archived Orders</h1>
            <div className="overflow-x-auto max-w-screen-2xl m-auto mt-6 mb-6">
                <table {...getTableProps()} className="table w-full table-compact table-zebra">
                    <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <>
                                    <th {...column.getHeaderProps()}>
                                        {column.render('Header')}
                                        <div>{column.canFilter ? column.render('Filter') : null}</div>
                                    </th>
                                </>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <React.Fragment>
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell, x) => {
                                        let name = "";
                                        if (x === 3) {
                                            name = "flex";
                                        }
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                className={name}
                                            >
                                                {cell.render('Cell')}
                                            </td>
                                        )
                                    })}
                                </tr>
                                {row.isExpanded ? (
                                    <tr>
                                        <td colSpan={visibleColumns.length} className="pl-32"></td>
                                    </tr>
                                ) : null}
                            </React.Fragment>
                        )
                    })}
                    </tbody>
                </table>
                <div className="pagination mt-6">
                    <button className="btn btn-sm" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>{' '}
                    <button className="btn btn-sm" onClick={() => previousPage()} disabled={!canPreviousPage}>{'<'}</button>{' '}
                    <button className="btn btn-sm" onClick={() => nextPage()} disabled={!canNextPage}>{'>'}</button>{' '}
                    <button className="btn btn-sm" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>{' '}
                    <span className="ml-4">Page{' '}<strong>{pageIndex + 1} of {pageOptions.length}</strong>{' '}</span>
                    <select
                        className="select select-bordered max-w-xs select-sm ml-4"
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value))
                        }}
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </Layout>
    )
}

export default LineItemsWithoutInvoices;