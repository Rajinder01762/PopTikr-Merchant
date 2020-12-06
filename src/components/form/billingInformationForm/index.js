import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { apiCallGet, apiCallPost } from "../../../common/api";
import { useMerchantProfile } from "../../../common/apiHooks";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../../../common/toaster";
import { MatrialInput } from "../inputs";
import { Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import { validateBillingFields } from "./helper";

const stripePromise = apiCallGet("/merchant/getpublickey").then((key) =>
  loadStripe(key.publicKey)
);

const options = {
  iconStyle: "solid",
  hidePostalCode: true,
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const BillingInformationForm = () => {
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const [userInfo, setCardUserInfo] = useState({});
  const elements = useElements();
  const [profile] = useMerchantProfile();
  const [isCardComplete, setCardComplete] = useState(false);

  async function getIntent() {
    const info = await apiCallPost("/merchant/createsetupintent", {}, true);
    return info?.stripintentData;
  }

  async function savePaymentData(strip_intent_id, payment_id, customer_id) {
    const info = await apiCallPost(
      "/merchant/savepaymentinfo",
      {
        strip_intent_id,
        customer_id,
        payment_id,
      },
      true
    );
    info && showSuccessToast("You card added for payment");
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const validationErrors = validateBillingFields(userInfo);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    } else {
      setErrors({});
    }

    if (!profile.email) {
      showErrorToast("Erro while fetching merchant profile");
      return false;
    }
    setProcessing(true);
    const intentInfo = await getIntent();

    if (intentInfo) {
      const payload = await stripe.confirmCardSetup(intentInfo.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: profile?.email,
            address: `${userInfo?.address}, ${userInfo?.address2}, ${userInfo?.city}, ${userInfo?.province}, ${userInfo?.zipCode} `,
            name: `${userInfo?.firstName} ${userInfo?.lastName} `,
          },
        },
      });

      if (payload.error) {
        setProcessing(false);
        showErrorToast("Server side issue while processing your card.");
      } else {
        setProcessing(false);
        const result = await stripe.retrieveSetupIntent(
          intentInfo.client_secret
        );
        if (result)
          savePaymentData(
            result.setupIntent.id,
            result.setupIntent.payment_method,
            intentInfo.customer
          );
      }
    }
    setProcessing(false);
  };

  return (
    <div>
      <Row>
        <Col className="mb-4" lg={12} xl={12}>
          <div className="theme-card profile-loaction-form h-100">
            <div className="checkout-form">
              <div className="sr-payment-form">
                <div className="sr-form-row" />
                <form onSubmit={handleSubmit}>
                  <p className="ml-4 bold">Card information</p>
                  <div className="sr-combo-inputs-row ">
                    <CardElement
                      onChange={(evt) => setCardComplete(evt.complete)}
                      className="mr-5 ml-5 sr-input sr-card-element"
                      options={options}
                    />
                  </div>

                  <RightForm
                    handleUserInfo={(name, value) => {
                      setCardUserInfo({ ...userInfo, [name]: value });
                    }}
                    cardUserInfo={userInfo}
                    errors={errors}
                  />
                  <div className="text-center">
                    <Button
                      type="submit"
                      disabled={!isCardComplete || processing || !stripe}
                      color="primary-black"
                    >
                      {processing ? "Processing…" : "Add Card"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default () => (
  <Elements stripe={stripePromise}>
    <BillingInformationForm />
  </Elements>
);

const RightForm = ({ errors, handleUserInfo, cardUserInfo }) => {
  return (
    <div className="theme-card profile-loaction-form">
      <p className="p3 bold">Billing information</p>

      {/* <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            name="primary"
            value={cardUserInfo ? cardUserInfo.primary : ""}
            onChange={(e) => handleUserInfo(e.target.name, e.target.checked)}
          />
          {" "}Same as primary location
        </Label>
      </FormGroup> */}
      <MatrialInput
        label="First Name"
        name="firstName"
        error={errors["firstName"] ? errors["firstName"] : ""}
        value={cardUserInfo ? cardUserInfo.firstName : ""}
        onChange={(e) => handleUserInfo(e.target.name, e.target.value)}
      />
      <MatrialInput
        label="Last Name"
        name="lastName"
        error={errors["lastName"] ? errors["lastName"] : ""}
        value={cardUserInfo ? cardUserInfo.lastName : ""}
        onChange={(e) => handleUserInfo(e.target.name, e.target.value)}
      />
      <MatrialInput
        label="Address Line 1"
        name="address"
        error={errors["address"] ? errors["address"] : ""}
        value={cardUserInfo ? cardUserInfo.address : ""}
        onChange={(e) => handleUserInfo(e.target.name, e.target.value)}
      />
      <MatrialInput
        label="Address Line 2"
        name="address2"
        error={errors["address2"] ? errors["address2"] : ""}
        value={cardUserInfo ? cardUserInfo.address2 : ""}
        onChange={(e) => handleUserInfo(e.target.name, e.target.value)}
      />
      <MatrialInput
        label="City"
        name="city"
        error={errors["city"] ? errors["city"] : ""}
        value={cardUserInfo ? cardUserInfo.city : ""}
        onChange={(e) => handleUserInfo(e.target.name, e.target.value)}
      />
      <MatrialInput
        label="Province"
        name="province"
        error={errors["province"] ? errors["province"] : ""}
        value={cardUserInfo ? cardUserInfo.province : ""}
        onChange={(e) => handleUserInfo(e.target.name, e.target.value)}
      />
      <MatrialInput
        label="Zip Code"
        name="zipCode"
        error={errors["zipCode"] ? errors["zipCode"] : ""}
        value={cardUserInfo ? cardUserInfo.zipCode : ""}
        onChange={(e) => handleUserInfo(e.target.name, e.target.value)}
      />
    </div>
  );
};

// const LeftForm = forwardRef(({ errors }, ref) => {
//   const [cardDetails, setCardDetails] = useState({});
//   const handleCardDetails = (name, value) => {
//     setCardDetails({ ...cardDetails, [name]: value });
//   };
//   useImperativeHandle(ref, () => ({
//     submitCardDetails() {
//       return cardDetails;
//     },
//   }));
//   const cardNumber = cardDetails ? cardDetails.cardNumber : "";
//   return (
//     <div className="theme-card profile-loaction-form h-100">
//       <FormGroup check>
//         <Label check>
//           <Input
//             type="checkbox"
//             name="stripeCC"
//             value={cardDetails ? cardDetails.stripeCC : ""}
//             onChange={(e) => handleCardDetails(e.target.name, e.target.checked)}
//           />
//           Credit Card via Stripe
//         </Label>
//       </FormGroup>
//       <MatrialInput
//         label="Card Number"
//         name="cardNumber"
//         type="number"
//         value={cardNumber || ""}
//         maxLength={16}
//         error={
//           errors["cardNumber"]
//             ? errors["cardNumber"]
//             : cardNumber &&
//               !validator.isCreditCard(cardNumber) &&
//               cardNumber.length === 16
//               ? "Card number is invalid!"
//               : ""
//         }
//         success={(() => {
//           const card = cardNumber ? cardType(cardNumber) : "";
//           if (
//             cardNumber &&
//             cardNumber.length === 16 &&
//             validator.isCreditCard(cardNumber)
//           )
//             return `${card} ${card !== "Mastercard" ? "card" : ""}`;
//           else return "";
//         })()}
//         onChange={(e) =>
//           e.target.value.length <= 16 &&
//           handleCardDetails(e.target.name, e.target.value)
//         }
//       />
//       <MatrialInput
//         label="Name on the Card"
//         name="cardName"
//         error={errors["cardName"] ? errors["cardName"] : ""}
//         value={cardDetails ? cardDetails.cardName : ""}
//         onChange={(e) => handleCardDetails(e.target.name, e.target.value)}
//       />
//       <Row>
//         <Col sm={6}>
//           <div className="my-3">
//             <DatePicker
//               minDate={moment().toDate()}
//               name="cardExpiry"
//               placeholderText="Expiry Date (MM/YYYY)"
//               className="w-100"
//               selected={cardDetails ? cardDetails.cardExpiry : ""}
//               onChange={(date) => handleCardDetails("cardExpiry", date)}
//             />

//             {errors["cardExpiry"] && (
//               <span className="text-danger form-error-text">
//                 {errors["cardExpiry"] || ""}
//               </span>
//             )}
//           </div>
//         </Col>
//         <Col sm={6}>
//           <MatrialInput
//             label="CVV"
//             name="cardCVV"
//             type="number"
//             error={errors["cardCVV"] ? errors["cardCVV"] : ""}
//             value={cardDetails ? cardDetails.cardCVV : ""}
//             onChange={(e) =>
//               e.target.value.length <= 3 &&
//               handleCardDetails(e.target.name, e.target.value)
//             }
//           />
//         </Col>
//       </Row>
//     </div>
//   );
// });
