import { ActivationCodeSchema, CancelReservationSchema, ReservationInput, RestaurantSearchQueryParams, SignInSchema, SignUpSchema, TRestaurantsResponse, TActivationCode, TCancelReservation, TReservationsResponse, TResponse, TRestaurantReservationsResponse, TRestaurantSearchSuggestionsResponse, TSignIn, TSignUp } from "./types";
import { capitalizeFirstLetter } from "./utils";

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
      if (response.status === 500) {
        return {
          serverError: "No Server Response"
        }
      }
      return {
        serverError: await response.json().then(data => {
          const s = data.message;
          return capitalizeFirstLetter(s);
        })
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
      return {
        serverError: await response.json().then(data => {
          const s = data.message;
          return capitalizeFirstLetter(s);
        })
      }
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


export const getUserById = async (id: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/users/view/id/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error: any) {
    if (!error.response) {
      return {};
    }
    return {};
  }
}

export const resendActivationCode = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/auth/new-activation-code`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      return { message: "Activation code sent" };
    } else {
      return {};
    }
  } catch (error: any) {
    if (!error.response) {
      return { message: "No server response" };
    }
    return {};
  }
}

export const activateUser = async (code: TActivationCode): Promise<TResponse> => {
  const result = ActivationCodeSchema.safeParse(code);

  if (!result.success) {
    return { status: 400, message: "Invalid activation code" };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/auth/activate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ Code: code.Code })
    });
    const data = await response.json();
    if (response.ok) {
      return { status: 200, message: "Account activated" };
    } else if (data.message === "renew your activation code") {
      return { status: 400, message: "Please renew your activation code" };
    } else {
      return { status: 400, message: "Invalid activation code" };
    }
  } catch (error: any) {
    if (!error.response) {
      return { status: 400, message: "No server response" };
    }
    return { status: 400, message: "Invalid activation code" };
  }
}

export const signOutUser = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/auth/sign-out`, {
      method: "POST",
      credentials: "include"
    });
    if (response.ok) {
      const data = await response.json();
      return data.status === "success";
    }
  } catch (error) {
    console.error("Error signing out: ", error);
    return false;
  }
}

export const getAllRestaurants = async ({ q, page = 1, limit = 20 }: RestaurantSearchQueryParams = {}): Promise<TRestaurantsResponse> => {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/restaurants/all`);
    if (q) {
      url.searchParams.append("q", q);
    }
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "GET",
      credentials: "include"
    });

    if (response.status === 200) {
      const data = await response.json();
      if (!data.restaurants) {
        return {
          status: 404,
          message: "No restaurants found",
        };
      }

      return {
        status: 200,
        restaurants: data.restaurants,
        totalPages: data.totalPages,
        message: "Restaurants fetched successfully",
      };
    } else if (response.status === 500) {
      return {
        status: 500,
        message: "No Server Response",
      };
    } else {
      return {
        status: 400,
        message: "Failed to fetch restaurants",
      };
    }
  } catch (error) {
    console.error("Error fetching restaurants: ", error);
    return {
      status: 400,
      message: "Failed to fetch restaurants",
    };
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
    }
  } catch (error: any) {
    if (!error.response) {
      console.error("No server response");
      return;
    }
    console.error("Error fetching restaurant: ", error);
    return;
  }
}

export const getAllReservationsByRestaurantId = async (id: string): Promise<TRestaurantReservationsResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/reservations/all/restaurant/${id}`, {
      method: "GET",
      credentials: "include"
    });
    if (response.ok) {
      const data = await response.json()
      if (data.length <= 0) {
        return {
          status: 200,
          message: "No reservations found",
          data: {},
        };
      }
      return {
        status: 200,
        message: "Reservations fetched successfully",
        data: data
      };
    }
  } catch (error: any) {
    if (!error.response) {
      console.error("Restaurant Reservations: No server response", error);
      return {
        status: 400,
        message: "No server response",
        data: {},
      };
    }
    console.error("Error fetching reservations: ", error);
    return {
      status: 400,
      message: "Failed to fetch reservations",
      data: {},
    };
  }

  return {
    status: 400,
    message: "Failed to fetch reservations",
    data: { reservations: [] },
  };
}

export const getTablesByRestaurantId = async (id: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/tables/all/restaurant/${id}`, {
      method: "GET",
      credentials: "include"
    });
    if (response.ok) {
      const data = await response.json()
      return data;
    }
  } catch (error: any) {
    // if (!error.response) {
    //   console.error("Restaurant Tables: No server response", error);
    //   return [];
    // }
    console.error("Error fetching tables: ", error);
    return [];
  }
}

export const makeTableReservation = async (formData: ReservationInput): Promise<TResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/reservations/make`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (response.status === 200 || response.status === 201) {
      return {
        status: 200,
        message: "Reservation made successfully"
      };
    } else if (response.status === 400 && data.message.includes("table occupied")) {
      return {
        status: 400,
        message: "Table is already reserved at that time"
      };
    } 
  } catch (error: any) {
    if (!error.response) {
      console.error("Tabel Reservations: No server response", error);
      return {
        status: 500,
        message: "No server response"
      };
    }

    console.error("Error making reservation: ", error);
    return {
      status: 400,
      message: "Failed to make reservation"
    };
  }

  return {
    status: 400,
    message: "Failed to make reservation"
  };
}

export const getSearchSuggestions = async (searchQuery: string): Promise<TRestaurantSearchSuggestionsResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/restaurants/suggestions?q=${searchQuery}`, {
      method: "GET",
      credentials: "include"
    });
    if (response.ok) {
      const data = await response.json();
      return {
        status: 200,
        message: "Suggestions fetched successfully",
        suggestions: data
      };
    }
  } catch (error: any) {
    if (!error.response) {
      console.error("No server response");
      return {
        status: 400,
        message: "No server response",
        suggestions: []
      };
    }
    return {
      status: 400,
      message: "Failed to fetch suggestions",
      suggestions: []
    };
  }
  return {
    status: 400,
    message: "Failed to fetch suggestions",
    suggestions: []
  };
}

export const getUserReservations = async (): Promise<TReservationsResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/reservations/all/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return {
        status: 200,
        message: "Reservations fetched successfully",
        reservations: data.reservations
      }
    }
  } catch (error: any) {
    if (!error.response) {
      console.error("No server response");
      return {
        status: 500,
        message: "No server response",
        reservations: []
      };
    }
    return {
      status: 400,
      message: "Failed to fetch reservations",
      reservations: []
    };
  }

  return {
    status: 400,
    message: "Failed to fetch reservations",
    reservations: []
  };
}

export const cancelReservation = async ({ id }: TCancelReservation): Promise<TResponse> => {
  try {
    const result = CancelReservationSchema.safeParse({ id });
    if (!result.success) {
      return {
        status: 400,
        message: "Invalid reservation id"
      };
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/reservations/cancel/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    });
    if (response.ok) {
      return {
        status: 200,
        message: "Reservation cancelled successfully"
      };
    }
  } catch (error: any) {
    if (!error.response) {
      console.error("No server response");
      return { status: 500, message: "No server response" };
    }
    return { status: 400, message: "Failed to cancel reservation" };
  }

  return { status: 400, message: "Failed to cancel reservation" };
}