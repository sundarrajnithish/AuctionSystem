import * as Yup from "yup";

export const formSchema = Yup.object().shape({
  auctionName: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("This field is required!"),
  category: Yup.string().required("Please Provide Category!"),
  startingBid: Yup.number()
    .min(1, "Bid Can't start at 0")
    .required("Please Provide Starting Value."),
  description: Yup.string()
    .min(2, "Too Short!")
    .max(1000, "Too long!")
    .required("This field is required!"),
  image: Yup.mixed()
    .required("An image is required")
    .test(
      "fileFormat",
      "Unsupported Format",
      (value) =>
        value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
    ),
});
