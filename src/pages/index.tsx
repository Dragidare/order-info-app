import { useState } from "react";
import { useRouter } from "next/router";

const Home: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const router = useRouter();
  const [errors, setErrors] = useState({
    orderNumber: "",
    zipCode: "",
    responseError: "",
  });

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    let newErrors = {
      orderNumber: "",
      zipCode: "",
      responseError: "",
    };

    // Validation for orderNumber and zipCode
    if (!orderNumber) newErrors.orderNumber = "Order number is required.";
    if (!zipCode) newErrors.zipCode = "Zip code is required.";

    // If validation errors exist, update the error state and exit the function
    if (newErrors.orderNumber || newErrors.zipCode) {
      setErrors(newErrors);
      return;
    }

    // Fetching logic
    const res = await fetch(`/api/${orderNumber}?zip=${zipCode}`);
    const data = await res.json();

    if (res.status === 200) {
      router.push(`/order/${orderNumber}/${zipCode}`);
    } else {
      newErrors.responseError =
        data?.message || "An error occurred. Please try again.";
      setErrors(newErrors);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg w-96 shadow-md"
      >
        <img src="/logo.png" alt="Logo" className="mx-auto -mt-16" />
        <h2 className="text-2xl font-bold text-center mt-4">
          Track your order
        </h2>
        <p className="text-gray-400 text-sm font-medium text-center mt-2">
          Enter your order number and zip code combination to see the order
          details and shipping updates
        </p>

        <div className="mt-4">
          <label
            htmlFor="orderNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Order Number
          </label>
          <input
            type="text"
            id="orderNumber"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="mt-1 border rounded w-full p-2"
          />
          {errors.orderNumber && (
            <p className="text-red-500 mt-1">{errors.orderNumber}</p>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="zipCode"
            className="block text-sm font-medium text-gray-700"
          >
            Zip Code
          </label>
          <input
            type="text"
            id="zipCode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="mt-1 border rounded w-full p-2"
          />
          {errors.zipCode && (
            <p className="text-red-500 mt-1">{errors.zipCode}</p>
          )}
        </div>

        <div className="mt-6">
          {errors.responseError && (
            <p className="text-red-500 mt-4">{errors.responseError}</p>
          )}
          <button
            type="submit"
            className="bg-blue-900 text-white p-2 rounded w-full"
          >
            Track
          </button>
        </div>
      </form>
    </div>
  );
};

export default Home;
