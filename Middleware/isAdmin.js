import Admin from "../Model/CompanyModel/adminModel.js";
import Company from "../Model/CompanyModel/companyModel.js";

export const isAdmin = async (req, res, next) => {
  const company = await Company.findById(req.params.id);
  const admin = await Admin.findOne({ company: req.params.id });
  if (company._id.toString() !== admin.company.toString())
    return res.status(403).send({ message: "Access Denied" });
  next();
};
