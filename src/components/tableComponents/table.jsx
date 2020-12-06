import React, { useState, useEffect, useCallback } from "react";
import { FormGroup, Input, Table } from "reactstrap";
import Header from "./tableHeader";
import Pagination from "./pagination";
import TableBody from "./tableBody";
import { apiCallGet } from "../../common/api";
import { generateQueryParameters } from "../../common/utils";
import _ from "lodash";
import { ConfirmModal } from "../modal";

export default ({
  headers,
  showEdit,
  showDelete,
  listPath,
  searchKey,
  title,
  showSwitch = false,
  handleEdit = () => {},
  handleSwitch,
  hotUpdate = false,
  handleDelete,
}) => {
  const [data, setData] = useState({
    data: [],
    total: 0,
    perPage: 10,
  });

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isOpenDelete, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  useEffect(() => {
    getData();
  }, [page, perPage, sortBy, sortOrder, search, hotUpdate]);

  const debounceInput = useCallback(
    _.debounce((value) => setSearch(value), 1000),
    []
  );
  const onChange = (e) => {
    setInputValue(e.target.value);
    debounceInput(e.target.value);
  };
  async function getData() {
    const listData = await apiCallGet(
      `${listPath}${generateQueryParameters({
        page,
        perPage,
        so: sortOrder,
        sb: sortBy,
        [searchKey]: search,
      })}`
    );
    listData?.results?.data && setData(listData.results);
  }
  return (
    <div className="h-100">
      <ConfirmModal
        toggle={() => setDeleteModal(!isOpenDelete)}
        isOpen={isOpenDelete}
        title="Confirm"
        content={`Are you sure?`}
        onConfirm={() => {
          handleDelete(deleteId, () => {
            setDeleteModal(false);
          });
        }}
      />
      <div className="table-theme-wrapper profile-table h-100 d-flex flex-column">
        <Table hover responsive className="bg-white table-theme">
          <Header
            onChange={onChange}
            searchValue={inputValue}
            title={title}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            showEdit={showEdit}
            showSwitch={showSwitch}
            showDelete={showDelete}
            headers={headers}
          />
          <TableBody
            showSwitch={showSwitch}
            handleSwitch={handleSwitch}
            handleEdit={handleEdit}
            handleDelete={(id) => {
              setDeleteId(id);
              setDeleteModal(true);
            }}
            showEdit={showEdit}
            showDelete={showDelete}
            data={data.data}
            headers={headers}
          />
        </Table>
        <div className="view-detail-action">
          <Pagination
            pageCount={Math.ceil(data.total / perPage)}
            onPageChange={({ selected }) => setPage(selected + 1)}
            perPage={perPage}
            onItemClick={(item) => {
              if (item !== perPage) {
                setPage(1);
                setPerPage(item);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
