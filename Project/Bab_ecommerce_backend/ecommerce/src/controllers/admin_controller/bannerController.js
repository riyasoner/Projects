const db = require("../../../config/config");
const { Op } = require("sequelize");
const Banner = db.banner;
// Add new banner
exports.createBanner = async (req, res) => {
  try {
    const { title, link, status } = req.body;
    const bannerImage = req.file ? `/bannerImage/${req.file.filename} ` : null; // agar multer use ho file upload ke liye

    if (!bannerImage) {
      return res.status(400).json({
        status: false,
        message: "Banner image is required",
      });
    }

    const banner = await Banner.create({
      title,
      bannerImage, // field name model ke hisab se correct karein
      link,
      status: status !== undefined ? status : true,
    });

    res.status(201).json({
      status: true,
      message: "Banner created successfully",
      banner,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

// Get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const { status } = req.query;

    // condition banate hain
    const condition = {};
    if (status !== undefined) {
      condition.status = status === "true";
    }

    const banners = await Banner.findAll({
      where: condition,
      order: [["createdAt", "DESC"]],
    });

    // full URL for banner image
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const bannersWithFullUrl = banners.map((b) => ({
      id: b.id,
      title: b.title,
      bannerImage: baseUrl + b.bannerImage, // model field ke hisab se
      link: b.link,
      status: b.status,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }));

    res.status(200).json({
      status: true,
      banners: bannersWithFullUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

// Update banner
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link, status } = req.body;

    const banner = await Banner.findByPk(id);

    if (!banner) {
      return res.status(404).json({
        status: false,
        message: "Banner not found",
      });
    }
    const bannerImage = req.file ? `/bannerImage/${req.file.filename} ` : null; // agar multer use ho file upload ke liye

    // Image update (agar file upload hui ho)
    if (req.file) {
      banner.bannerImage = bannerImage;
    }

    if (title !== undefined) banner.title = title;
    if (link !== undefined) banner.link = link;
    if (status !== undefined) banner.status = status;

    await banner.save();

    // full URL for updated banner image
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const updatedBanner = {
      id: banner.id,
      title: banner.title,
      bannerImage: baseUrl + banner.bannerImage,
      link: banner.link,
      status: banner.status,
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt,
    };

    res.status(200).json({
      status: true,
      message: "Banner updated successfully",
      banner: updatedBanner,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

// Delete banner
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);

    if (!banner) {
      return res.status(404).json({
        status: false,
        message: "Banner not found",
      });
    }

    await banner.destroy();

    res.status(200).json({
      status: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};
