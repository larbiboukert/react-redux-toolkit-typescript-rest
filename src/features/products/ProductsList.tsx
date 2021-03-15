import styles from "./ProductsList.module.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../app/store";
import { getProducts, selectAllProducts } from "./productsSlice";
import { Pagination, Table } from "react-bootstrap";

const ProductsList = () => {
  const products = useSelector(selectAllProducts);
  const status = useSelector((state: RootState) => state.products.status);
  const error = useSelector((state: RootState) => state.products.error);

  const [page, setPage] = useState(1);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getProducts(page));
  }, [page, dispatch]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-end">
        <h1 className="display-4">Products List</h1>
        <Pagination>
          <Pagination.Prev onClick={() => setPage(page - 1)} />
          {page !== 1 && <Pagination.Ellipsis disabled={page === 1} />}
          <Pagination.Item active>{page}</Pagination.Item>
          {page !== 11 && <Pagination.Ellipsis disabled={page === 11} />}
          <Pagination.Next onClick={() => setPage(page + 1)} />
        </Pagination>
      </div>
      <Table responsive striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Discount Amount</th>
            <th>Status</th>
            <th>Categories</th>
          </tr>
        </thead>
        <tbody>
          {status === "loading" && (
            <tr>
              <td>Loading..</td>
            </tr>
          )}
          {status === "failed" && (
            <tr>
              <td>{`${error?.name}: ${error?.message}`}</td>
            </tr>
          )}
          {status === "succeeded" &&
            (products.length === 0 ? (
              <tr>
                <td>Empty</td>
              </tr>
            ) : (
              <>
                {products.map((product, key) => (
                  <tr key={key}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.discount_amount}</td>
                    <td>{product.status.toString()}</td>
                    <td>
                      {product.categories.map((category) => category.name)}
                    </td>
                  </tr>
                ))}
              </>
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default ProductsList;
