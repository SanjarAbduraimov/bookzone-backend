const fs = require("fs");
const Files = require("../models/files");
const constants = require("../constants/constants");

const { webImgtoFile, resizeImg } = require("../utils");

function createFileUrl(req, filename) {
  if (filename) {
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/` + filename;
    return imageUrl;
  }
  return "";
}

exports.fetchAllFiles = async (req, res) => {
  try {
    const {
      page = 1,
      size = constants.DEFAULT_PAGE_SIZE,
      isDeleted = false,
      centerId,
    } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: size,
      sort: {
        name: 1,
      },
      pagination: page == "-1" ? false : true,
    };

    const filters = {
      isDeleted,
    };
    if (centerId) {
      filters.center = centerId;
    }

    const { docs, ...pagination } = await Files.paginate(
      {
        ...filters,
      },
      options
    );
    return res.json({
      payload: docs,
      pagination,
      success: true,
    });
  } catch (err) {
    return res.send(err);
  }
};

exports.fetchFilesById = (req, res) => {
  const { id } = req.params;

  Files.findById(id)
    .then((data) => {
      res.json({
        payload: data,
      });
    })
    .catch((err) => res.send(err));
};

exports.createFiles = async (req, res) => {
  console.log(req.body, "req.body");
  console.log(req.files, "req.body");
  const { _id: user } = req.locals;
  const files = await Promise.all(
    req.files?.map((item) => {
      const { originalname, filename, size, mimetype } = item;
      try {
        return {
          size,
          mimetype,
          url: createFileUrl(req, filename),
          filename: originalname,
          user,
        };
      } catch (err) {
        return null;
      }
    })
  );

  return Files.insertMany(files)
    .then((data) => {
      if (req.body?.oldImg?.length) {
        deleteImgaes(req.body.oldImg);
      }
      return res.json({
        success: true,
        payload: data,
        msg: "File created",
      });
    })
    .catch((err) => {
      res.json({
        success: false,
        msg: err.message,
      });
    });
};

exports.createBase64Files = async (req, res) => {
  const { center } = req.locals;

  if (!req.body.files.length) {
    return res.json({
      success: false,
      msg: "NO files to upload",
    });
  }

  const files = await Promise.all(
    req.body.files?.map((item) => {
      const imagePath = webImgtoFile(item);
      return {
        mimetype: "image/jpeg",
        url: createFileUrl(req, imagePath),
        filename: "base64 image",
        center,
      };
    })
  );

  return Files.insertMany(files)
    .then((data) => {
      if (req.body?.oldImg?.length) {
        deleteImgaes(req.body.oldImg);
      }
      return res.json({
        success: true,
        payload: data,
        msg: "FIle_created",
      });
    })
    .catch((err) => {
      res.json({
        success: false,
        msg: err.message,
      });
    });
};

exports.deleteById = (req, res) => {
  const { files } = req.body;
  Files.updateMany(
    {
      _id: {
        $in: files,
      },
    },
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  )
    .then(() => {
      res.json({
        success: true,
        msg: "Successfully deleted",
      });
    })
    .catch((err) => res.send(err));
};

function deleteImgaes(imageUrl) {
  if (imageUrl.length) {
    const url = `public${imageUrl.slice(imageUrl.indexOf("/uploads"))}`;
    console.log(url, "url");
    const isFileExist = fs.existsSync(url);
    if (isFileExist) {
      fs.unlink(url, (err) => {
        if (err) {
          console.log(err);
        }
        Files.findOneAndDelete({
          url: imageUrl,
        })
          .then((res) => {
            console.log("Image is deleted");
          })
          .catch((err) => console.log(err));
      });
    }
  }
}
