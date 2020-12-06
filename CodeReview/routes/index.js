import React from "react";
import Layout from "../components/layout";
import AccountLayout from "../components/accountLayout";
import {
  Dashboard,
  Deals,
  Login,
  Register,
  Profile,
  Billing,
  PaymentFailure,
  PaymentSuccess,
  TermsConditions,
  ForgotPassword,
  ResetPassword,
  Program,
  ManageTax,
  ManageTimezone,
  ManageUsers,
  Categories,
  Settings,
  CMS,
  Merchant,
} from "../pages";
import {
  Switch,
  Route,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";

const PrivateRoutes = () => {
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
  if (isAdmin) {
    return (
      <Layout>
        <Switch>
          <Route exact path="/dashboard" component={Dashboard} />

          <Route exact path="/profile" component={Profile} />
          <Route exact path="/programs" component={Program} />
          <Route exact path="/tax" component={ManageTax} />
          <Route exact path="/timezone" component={ManageTimezone} />
          <Route exact path="/users" component={ManageUsers} />
          <Route exact path="/categories" component={Categories} />
          <Route exact path="/cms" component={CMS} />
          <Route exact path="/settings" component={Settings} />
          <Route exact path="/merchant" component={Merchant} />
          <Route exact path="/terms-conditions" component={TermsConditions} />
          <Route exact path="/**" component={Dashboard} />
        </Switch>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Switch>
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/deals" component={Deals} />
          <Route exact path="/deals/add" component={Deals} />
          <Route exact path="/deals/edit/:dealId" component={Deals} />
          <Route exact path="/billing" component={Billing} />
          <Route exact path="/terms-conditions" component={TermsConditions} />
          <Route exact path="/**" component={Dashboard} />
          {/* <Route exact path="/payment-failure" component={PaymentFailure} />
        <Route exact path="/payment-success" component={PaymentSuccess} /> */}
        </Switch>
      </Layout>
    );
  }
};

const PublicRoute = () => {
  return (
    <AccountLayout>
      <Switch>
        <Route exact path="/login" render={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/terms-conditions" component={TermsConditions} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/reset-password" component={ResetPassword} />
        <Route exact path="/admin/login" render={Login} />
        <Route exact path="/admin/reset-password" component={ResetPassword} />
        <Route exact path="/admin/forgot-password" component={ForgotPassword} />
        <Route exact path="/**" component={Login} />
      </Switch>
    </AccountLayout>
  );
};

export default () => {
  const authToken = localStorage.getItem("token");
  return (
    <Router>
      <Switch>
        {authToken ? (
          <Route path="/" render={(props) => <PrivateRoutes {...props} />} />
        ) : (
          <Route path="/" render={(props) => <PublicRoute {...props} />} />
        )}
      </Switch>
    </Router>
  );
};
