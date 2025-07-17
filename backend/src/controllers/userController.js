const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const Role = require("../models/Role");
const { Sequelize, Op } = require("sequelize");

exports.getProfile = async (req, res) => {
  try {
    console.log("Getting profile for user:", req.user);
    const user = await User.findByPk(req.user.userId, {
      attributes: [
        "name",
        "email",
        "phone",
        "accountType",
        "korporSince",
        "intro",
        "investmentUsedPct",
        "investmentTotal",
        "globalUsers",
        "globalCountries",
        "isVerified",
        "approvalStatus",
        "profilePicture",
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const accountData = {
      id: req.user.userId,
      name: user.name,
      email: user.email,
      phone: user.phone || "+21629453228",
      accountType: user.accountType || "Individual Account",
      korporSince: new Date(user.korporSince).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      intro: user.intro || "Korpor Intro",
      investmentUsedPct: user.investmentUsedPct || 0,
      investmentTotal: user.investmentTotal || 367000,
      globalUsers: user.globalUsers || 1000000,
      globalCountries: user.globalCountries || 209,
      isVerified: user.isVerified || false,
      approvalStatus: user.approvalStatus || "pending",
      profilePicture: user.profilePicture || null,
      verificationProgress: {
        completed: user.isVerified ? 4 : 2,
        total: 4,
      },
    };

    res.json(accountData);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      accountType,
      intro,
      investmentUsedPct,
      investmentTotal,
      globalUsers,
      globalCountries,
    } = req.body;

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    await user.update({
      name: name || user.name,
      phone: phone || user.phone,
      accountType: accountType || user.accountType,
      intro: intro || user.intro,
      investmentUsedPct: investmentUsedPct || user.investmentUsedPct,
      investmentTotal: investmentTotal || user.investmentTotal,
      globalUsers: globalUsers || user.globalUsers,
      globalCountries: globalCountries || user.globalCountries,
    });

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.cloudinaryPublicId)
      await cloudinary.uploader.destroy(user.cloudinaryPublicId);

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "profile_pictures" },
      async (error, result) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ message: "Cloudinary upload error", error });
        }
        user.profilePicture = result.secure_url;
        user.cloudinaryPublicId = result.public_id;
        await user.save();
        return res.json({
          message: "Profile picture updated",
          profilePicture: user.profilePicture,
        });
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Get all users
 * @route GET /api/users
 * @access Private (authenticated users)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 100,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      role,
      search
    } = req.query;

    // Build where conditions
    const whereConditions = {};
    
    // Filter by approval status
    if (status) {
      whereConditions.approvalStatus = status;
    }

    // Search in name, surname, email
    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { surname: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const users = await User.findAll({
      where: whereConditions,
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "name"],
          required: false
        }
      ],
      attributes: {
        exclude: ['password', 'refreshToken', 'emailVerificationCode', 'signupVerificationCode']
      },
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    // Transform the data to match frontend expectations
    const transformedUsers = users.map((user) => {
      // Map approval status to frontend status
      let status = 'pending';
      switch (user.approvalStatus) {
        case 'approved':
          status = 'active';
          break;
        case 'rejected':
          status = 'rejected';
          break;
        case 'pending':
          status = 'pending';
          break;
        case 'unverified':
          status = 'unverified';
          break;
        default:
          status = 'pending';
      }

      return {
        id: user.id.toString(),
        firstName: user.name || "",
        lastName: user.surname || "",
        username: user.email ? user.email.split("@")[0] : "",
        email: user.email,
        phoneNumber: user.phoneNumber || user.phone || "",
        status: status,
        approvalStatus: user.approvalStatus,
        rawApprovalStatus: user.approvalStatus,
        role: user.role ? user.role.name.toLowerCase() : "user",
        isVerified: user.isVerified || false,
        walletAddress: user.walletAddress || "",
        accountNo: user.accountNo ? user.accountNo.toString() : "",
        birthdate: user.birthdate ? user.birthdate.toISOString().split('T')[0] : "",
        profilePicture: user.profilePicture || "",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    // Get total count for pagination
    const totalUsers = await User.count({ where: whereConditions });

    return res.status(200).json({
      success: true,
      count: transformedUsers.length,
      total: totalUsers,
      totalPages: Math.ceil(totalUsers / parseInt(limit)),
      currentPage: parseInt(page),
      data: transformedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching users",
      error: error.message 
    });
  }
};
