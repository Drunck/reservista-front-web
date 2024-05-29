import { ReservationInput, SignInSchema, SignUpSchema, TSignIn, TSignUp } from "./types";

export const signInUser = async (formData: TSignIn) => {
  try {
    const result = SignInSchema.safeParse(formData);

    if (!result.success) {
      let validationErrors = result.error.issues.map((issue) => {
        return {
          [issue.path[0]]: issue.message
        };
      });

      return {
        errors: validationErrors
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      return {
        serverError: await response.json().then(data => data.message)
      }
    }
  }
  catch (error: any) {
    if (!error?.response) {
      return {
        serverError: "No Server Response"
      }
    } else {
      return {
        serverError: "Sign in failed"
      }
    }
  }
}

export const signUpUser = async (formData: TSignUp) => {
  try {
    const result = SignUpSchema.safeParse(formData);

    if (!result.success) {
      let validationErrors = result.error.issues.map((issue) => {
        return {
          [issue.path[0]]: issue.message
        };
      });

      return {
        errors: validationErrors
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/auth/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      // console.log("Response", response);
      return { serverError: "This email already exists" }
    }
  }
  catch (error: any) {
    if (!error?.response) {
      return { serverError: "No Server Response" }
    } else {
      return { serverError: "Sign up failed" }
    }
  }
}

export const signOutUser = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/auth/sign-out`, {
      method: "POST",
      credentials: "include"
    });
    const data = await response.json();
    return data.status === "success";
  } catch (error) {
    console.error("Error signing out: ", error);
    return false;
  }
}

export const getAllRestaurants = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/restaurants/all`, {
      method: "GET",
      credentials: "include"
    });

    if (response.ok) {
      return await response.json();
    } else {
      return await response.json();
    }
  } catch (error) {
    return error;
  }
}

export const getRestaurantById = async (id: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/restaurants/view/${id}`, {
      method: "GET",
      credentials: "include"
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch restaurant");
      return {};
    }
  } catch (error) {
    console.error("Error fetching restaurant: ", error);
    return {};
  }
}

export const getAllReservationsByRestaurantId = async (id: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/reservations/all/restaurant/${id}`, {
      method: "GET",
      credentials: "include"
    });
    // console.log("Response", response);
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch reservations");
      return [];
    }
  } catch (error) {
    console.error("Error fetching reservations: ", error);
    return [];
  }
}

export const getTablesByRestaurantId = async (id: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/tables/all/restaurant/${id}`, {
      method: "GET",
      credentials: "include"
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch tables");
      return [];
    }
  } catch (error) {
    console.error("Error fetching tables: ", error);
    return [];
  }
}

export const makeTableReservation = async (formData: ReservationInput) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/reservations/make`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to make reservation");
      return {};
    }
  } catch (error) {
    console.error("Error making reservation: ", error);
    return {};
  }
}

export const getUserReservations = async (userId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/reservations/all/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    });
    console.log("USER RESERVATION", response);
  } catch (error) {
    console.log(error);
  }
}

export const activateUser = async (code: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/auth/activate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ code })
    });
    if (response.status === 200) {
      return await response.json();
    } else {
      return await response.json();
    }
    console.log("ACTIVATE USER", response);
    return await response.json();
  } catch (error) {
    console.error("Error activating user: ", error);
    return {};
  }
}