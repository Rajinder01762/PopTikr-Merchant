import { loadStripe } from "@stripe/stripe-js";
import { showErrorToast, showSuccessToast } from "./toaster";
const stripePromise = loadStripe("pk_test_WWEZE7y9tnqTNcetzbSWsEo300REAzXW4j");
export async function redirectToCheckout(data) {
  const stripe = await stripePromise;

  const response = await fetch("http://localhost:8080/create-session", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (response.status === 200) {
    const session = await response.json();
    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    if (result.error) {
      showErrorToast("Error while payment");
    } else {
      showSuccessToast("Payment success");
    }
  } else {
    showErrorToast("Server side error");
  }
}
