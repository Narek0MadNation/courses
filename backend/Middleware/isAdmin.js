import Admin from "../Model/CompanyModel/adminModel.js";
import Company from "../Model/CompanyModel/companyModel.js";

export const isAdmin = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).send({ message: "Company not found" });

    const admin = await Admin.findOne({ company: req.params.id });
    if (!admin) return res.status(404).send({ message: "Admin not found" });

    // if (company.admin.toString() !== admin._id.toString()) {
    //   return res.status(403).send({ message: "Access Denied" });
    // }

    if (company._id.toString() !== admin.company.toString()) {
      return res.status(403).send({ message: "Access Denied" });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};
