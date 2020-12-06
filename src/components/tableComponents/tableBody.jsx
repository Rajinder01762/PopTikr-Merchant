import React from "react";
import { CustomInput } from "reactstrap";
import editIcon from "../../assets/images/icons/edit-icon.svg";

export default ({
  data,
  headers,
  showEdit,
  showDelete,
  handleEdit,
  handleDelete,
  handleSwitch,
  showSwitch,
}) => {
  return (
    <tbody>
      {data?.length > 0 ? (
        data.map((row, index) => {
          return (
            <tr key={index}>
              {headers.map((item) => (
                <>
                  {!item.hidden ? (
                    <td className="text-nowrap">{row[item.selector]}</td>
                  ) : null}
                </>
              ))}

              {showEdit && (
                <td className="text-nowrap text-center">
                  <button
                    onClick={() => handleEdit(row)}
                    className="btn-icon type-image"
                  >
                    <img src={editIcon} alt="edit" />
                  </button>
                </td>
              )}
              {showDelete && (
                <td className=" text-nowrap text-center">
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="btn-icon type-image"
                  >
                    <i className={"fas fa-trash"} />
                  </button>
                </td>
              )}
              {showSwitch && (
                <td className=" text-nowrap text-center">
                  <CustomInput
                    onChange={(evt) =>
                      evt?.target?.checked && handleSwitch(row.id)
                    }
                    type="switch"
                    id={row.id}
                    name="customSwitch"
                  />
                </td>
              )}
            </tr>
          );
        })
      ) : (
        <p className="text-nowrap text-center">No data to display</p>
      )}
    </tbody>
  );
};
