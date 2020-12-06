import React, { useEffect, useState } from "react";
import { Row, Col, Table, Button } from "reactstrap";
import { apiCallPost, apiCallGet } from "../../common/api";
import { MatrialInput } from "../../components/form/inputs";

export default () => {
  const [settings, setSettings] = useState([]);
  useEffect(() => {
    getSettings();
  }, []);

  async function getSettings() {
    const data = await apiCallGet("/admin/settings");
    data?.success && setSettings(data.results);
  }

  async function updateSettings() {
    await apiCallPost("/admin/settings", { settingdata: settings }, true);
    getSettings();
  }
  const handleChange = (value, index, key) => {
    const data = [...settings];
    const old = data[index];
    const updated = { ...old, [key]: value };
    data.splice(index, 1, updated);
    setSettings(data);
  };
  return (
    <div className="form-column align-items-center">
      <Row className="d-flex align-items-center  justify-content-center">
        <Col lg={8} xl={8}>
          <div className="table-theme-wrapper profile-table h-100 d-flex flex-column">
            <Table hover responsive className="bg-white table-theme">
              <thead>
                <tr>
                  <th colSpan={2} className="text-center">
                    Manage Settings
                  </th>
                </tr>
              </thead>
              <tbody>
                {settings &&
                  settings.map((item, key) => {
                    return (
                      <tr key={key}>
                        <td>
                          <MatrialInput
                            disabled
                            label="Code"
                            name={item.code}
                            value={item.code}
                            onChange={(e) =>
                              handleChange(e.target.value, key, "code")
                            }
                          />
                        </td>
                        <td>
                          <MatrialInput
                            label="Value"
                            name={item.code}
                            value={item.value}
                            onChange={(e) =>
                              handleChange(e.target.value, key, "value")
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
              <tfoot>
                <tr>
                  <td>
                    <Button
                      title="Update"
                      color="primary-black"
                      onClick={() => updateSettings()}
                    >
                      Update
                    </Button>
                  </td>
                  {/* <td className="text-right">
                    <Button
                      title="Add More"
                      onClick={() =>
                        setSettings([...settings, { code: "", value: "" }])
                      }
                    >
                      +
                    </Button>
                  </td> */}
                </tr>
              </tfoot>
            </Table>
          </div>
        </Col>
      </Row>
    </div>
  );
};
