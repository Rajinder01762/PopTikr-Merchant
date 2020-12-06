import React, { useEffect, useState } from "react";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { MatrialInput } from "../form/inputs";
import Select from "react-select";
import {
  convertOptionToValue,
  convertOptionsToValue,
  getCustomOptions,
} from "../../common/utils";
import { apiCallUploadFile } from "../../common/api";
import { showErrorToast } from "../../common/toaster";
import _, { isString } from "lodash";
import { useLanguages } from "../../common/apiHooks";

export default ({
  onSubmit = () => {},
  formFields = [],
  data,
  errors,
  onlyUpdate = false,
  forceUpdate = false,
  showReset = true,
}) => {
  const [formData, setFormData] = useState({});
  const [language, setLanguage] = useState({ label: "English", value: "en" });
  const languages = useLanguages();
  const lang = language.value || "en";

  const getLangName = (name) => {
    return `translations.${lang}.${name}`;
  };

  const setTranslationValue = (fieldname, fieldvalue) => {
    const langData =
      formData.translations && Object.keys(formData.translations).length
        ? formData.translations
        : {};
    const subData = Object.keys(langData).length > 0 ? langData[lang] : {};
    setFormData({
      ...formData,
      translations: {
        ...langData,
        [lang]: {
          ...subData,
          [fieldname]: fieldvalue,
        },
      },
    });
  };

  useEffect(() => {
    data && setFormData(data);
  }, [data]);

  function onHandleChange(fieldname, fieldvalue, stateObj) {
    if (stateObj) {
      setFormData({ ...formData, ...stateObj });
    } else {
      setFormData({ ...formData, [fieldname]: fieldvalue });
    }
  }

  return (
    <div>
      <div className="theme-card mb-4 profile-loaction-form">
        {formFields.map((field) => {
          switch (field.type) {
            case "text":
              return (
                <MatrialInput
                  disabled={field.disabled}
                  label={field.label}
                  name={field.name}
                  value={
                    field.isLangBased
                      ? _.get(formData, getLangName(field.name))
                      : formData[field.name] || ""
                  }
                  onChange={(e) => {
                    if (field && field.isLangBased) {
                      setTranslationValue(e.target.name, e.target.value);
                    } else onHandleChange(e.target.name, e.target.value);
                  }}
                  error={
                    errors?.[field.name]
                      ? isString(errors?.[field.name])
                        ? errors?.[field.name]
                        : field.error
                      : false
                  }
                />
              );
            case "number":
              return (
                <MatrialInput
                  disabled={field.disabled}
                  type={"number"}
                  label={field.label}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    onHandleChange(
                      e.target.name,
                      parseInt(e?.target?.value || 0)
                    )
                  }
                  error={errors?.[field.name] && field.error}
                />
              );
            case "made_in":
              return (
                <Label check>
                  <Input
                    type="checkbox"
                    checked={formData[field.name] ? true : false}
                    onChange={(e) => {
                      onHandleChange(
                        "made_in",
                        e?.target?.checked ? "Canada" : ""
                      );
                    }}
                  />{" "}
                  Shop owned and operated in Canada
                </Label>
              );
            case "textarea":
              return (
                <MatrialInput
                  disabled={field.disabled}
                  type={"textarea"}
                  label={field.label}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    onHandleChange(e.target.name, e?.target?.value)
                  }
                  error={errors?.[field.name] && field.error}
                />
              );
            case "upload":
              return (
                <MatrialInput
                  disabled={field.disabled}
                  type={"upload"}
                  maxFileSize={field.maxFileSize}
                  contentType={field.contentType}
                  label={field.label}
                  showType={field.showType}
                  name={field.name}
                  value={formData[field.name] || ""}
                  path={formData[field.path] || ""}
                  onChange={async (evt) => {
                    const file = evt?.target?.files[0];
                    if (file) {
                      const fileSize = file.size / 1024 / 1024;
                      const maxFileSize = field.maxFileSize || 2;
                      if (fileSize <= maxFileSize) {
                        const formData = new FormData();
                        formData.append(field.mediaType || "image", file);

                        const link = await apiCallUploadFile(
                          field.uploadUrl,
                          formData,
                          true
                        );
                        if (link) {
                          const fileName = _.includes(
                            link.filename,
                            "/category"
                          )
                            ? link.filename
                            : `${field.previewUrl}${link.filename}`;
                          onHandleChange(null, null, {
                            [field.name]: link.filename,
                            [field.path]: fileName,
                          });
                        }
                      } else {
                        showErrorToast(
                          `Maximum image size supported is ${maxFileSize}MB`
                        );
                      }
                    }
                  }}
                  error={errors?.[field.name] && field.error}
                />
              );
            case "select":
              if (field.isLanguageSelect) {
                return (
                  <div className="my-3">
                    <Select
                      classNamePrefix="matrail-select"
                      isDisabled={field.disabled}
                      options={
                        languages
                          ? languages.map((item) => ({
                              label: item.lang_title,
                              value: item.lang_code,
                            }))
                          : []
                      }
                      value={language}
                      placeholder={field.placeholder}
                      name={field.name}
                      onChange={(option) => {
                        setLanguage(option);
                      }}
                    />
                    {errors?.[field.name] && (
                      <span className="text-danger form-error-text">
                        {field.error}
                      </span>
                    )}
                  </div>
                );
              } else
                return (
                  <div className="my-3">
                    <Select
                      classNamePrefix="matrail-select"
                      options={field.options}
                      value={field.options.find(
                        (item) =>
                          item.value === formData[field.name] ||
                          item.label === formData[field.name]
                      )}
                      name={field.name}
                      onChange={(options) =>
                        onHandleChange(
                          field.name,
                          convertOptionToValue(options)
                        )
                      }
                      placeholder={field.placeholder}
                    />
                    {errors?.[field.name] && (
                      <span className="text-danger form-error-text">
                        {field.error}
                      </span>
                    )}
                  </div>
                );

            case "multi-select":
              return (
                <div className="my-3">
                  <Select
                    classNamePrefix="matrail-select"
                    isMulti
                    options={field.options.map((item) => ({
                      label: item[field?.optionLabel],
                      value: item[field?.id],
                    }))}
                    value={getCustomOptions(
                      formData[field.name],
                      field.options,
                      field?.id,
                      field?.optionLabel
                    )}
                    name={field.name}
                    onChange={(options) =>
                      onHandleChange(field.name, convertOptionsToValue(options))
                    }
                    placeholder={field.placeholder}
                  />
                  {errors?.[field.name] && (
                    <span className="text-danger form-error-text">
                      {field.error}
                    </span>
                  )}
                </div>
              );

            default:
              return <div />;
          }
        })}
      </div>
      <div className="d-flex justify-content-between">
        <Button
          color="primary-black"
          onClick={() =>
            onSubmit(formData, () => {
              setFormData({});
            })
          }
        >
          {data?.id || onlyUpdate ? "Update" : "Add"}
        </Button>

        {showReset && (
          <button className="btn bg-white" onClick={() => setFormData({})}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
