import Layout from '../components/layout'
import React from 'react';
import { useTable, useFilters, useGlobalFilter, usePagination, useExpanded, useSortBy } from "react-table";

const apiEndpoint = "https://strapi-iteh.onrender.com/api/orders?[populate]=*&pagination[pageSize]=50&sort=id%3Adesc&filters[Archived][$ne]=true";
const cmsDomain = "https://strapi-iteh.onrender.com";

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

function Table(row) {
    const data = React.useMemo(() => row.data.original.test, []);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Client',
                accessor: 'client',
            },
            {
                Header: 'Type',
                accessor: 'type',
            },
            {
                Header: 'Impressions',
                accessor: 'goal',
            },
            {
                Header: 'Scheduled Date',
                accessor: 'date',
            },
            {
                Header: 'Paid',
                accessor: 'paid',
            },
            {
                Header: 'Invoice',
                accessor: 'invoice',
            },
            {
                Header: 'Status',
                accessor: 'status',
            },
        ],
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data })

    return (
        <table {...getTableProps()} className="table w-full table-compact">
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()} className="border-b-4">
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()} >
                            {column.render('Header')}
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map(row => {
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return (
                                <td {...cell.getCellProps()} >
                                    {cell.render('Cell')}
                                </td>
                            )
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}

const AllOrders = ({ sortedData }) => {
    let colData = [];
    let inventory = [];
    let subInventory = [];
    let subItem = {};
    let paid = null;
    let url = "";
    let send = "";

    sortedData.forEach(element => {
        element.attributes.line_items.forEach(lineItem => {
            let classes = "w-8 mr-1 ";
            let status = "";
            let rawDate = "-";
            let formattedDate = "-";
            let client = "NA";
            let invoice = "-";

            if (lineItem.complete === true) {
                classes +="border-b-2 border-teal-500";
                status = "Complete";
            } else {
                status = "Incomplete"
            }

            if (lineItem.paid.toString() === "true") {
                paid = "Paid"
            } else {
                paid = "Unpaid";
            }

            if (lineItem.scheduled_send) {
                rawDate = new Date(lineItem.scheduled_send);
                formattedDate = new Date( rawDate.getTime() + Math.abs(rawDate.getTimezoneOffset()*60000) ).toDateString()
            } else if (lineItem.post_date) {
                rawDate = new Date(lineItem.post_date);
                formattedDate = new Date( rawDate.getTime() + Math.abs(rawDate.getTimezoneOffset()*60000) ).toDateString()
            }

            if (lineItem.client) {
                client = lineItem.client;
            }

            if (lineItem.invoice) {
                invoice = lineItem.invoice;
            }

            subItem.client = client;
            subItem.paid = paid;
            subItem.status = status;
            subItem.date = formattedDate;
            subItem.goal = parseInt(lineItem.goal).toLocaleString();
            subItem.invoice = invoice;

            switch(lineItem.__component) {
                case "order.dedicated-email":
                    inventory.push(<img className={classes} src="/dedicated.png"/>);
                    subItem.type = "Dedicated Email Send";
                    break;
                case "order.display":
                    inventory.push(<img className={classes} src="/banner.png"/>);
                    subItem.type = "Display";
                    break;
                case "order.newsletter":
                    inventory.push(<img className={classes} src="/newsletter.png"/>);
                    subItem.type = "Newsletter";
                    break;
                case "order.sponsored-article":
                    inventory.push(<img className={classes} src="/sponsored.png"/>);
                    subItem.type = "Sponsored Post";
                    break;
            }
            subInventory.push(subItem)
            subItem = {};
        });

        if (element.attributes.IO.data) {
            url = <a href={`${cmsDomain}${element.attributes.IO.data.attributes.url}`} className="underline">View IO</a>
        }

        if (element.attributes.scheduled_send) {
            send = element.attributes.scheduled_send;
        }

        if (element.attributes.paid.toString() === "true") {
            paid = "Paid"
        } else {
            paid = "Unpaid";
        }

        colData.push({
            col1: element.attributes.order_id,
            col2: element.attributes.advertiser.data.attributes.advertiser_name,
            col3: paid,
            col4: cleanString(element.attributes.status),
            col5: inventory,
            col6: url,
            test: subInventory,
        });

        subInventory = [];
        paid = null;
        url = "";
        inventory = [];
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
                        {row.isExpanded ? <img src="/minus.png" className="w-5" /> : <img src="/plus.png" className="w-5" />}
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
            {
                Header: 'IO',
                disableFilters: true,
                accessor: 'col6',
            },
        ],
        []
    )

    const renderRowSubComponent = React.useCallback(
        ({ row }) => (
            <Table data={row}/>
        ),
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
            renderRowSubComponent,
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        useExpanded,
        usePagination,
    )

    return (
        <Layout>
            <h1 className="text-center text-xl">Current Orders</h1>
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
                                        <td colSpan={visibleColumns.length} className="pl-16">
                                            {renderRowSubComponent({ row })}
                                        </td>
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

export default AllOrders;