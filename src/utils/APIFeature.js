export class APIFeatures {
  // queryString = req.query
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  //   Pagination
  pagination() {
    let page = this.queryString.page * 1 || 1;
    if (this.queryString.page <= 0) page = 1;
    const skip = (page - 1) * 5;
    this.mongooseQuery.skip(skip).limit(5);
    this.page = page;
    return this;
  }

  //   Filter
  filter() {
    let filterObj = { ...this.queryString };
    let excludeFilter = ["sort", "keyword", "fields", "page"];
    excludeFilter.forEach((x) => {
      delete filterObj[x];
    });

    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(
      /\b(gt|gte|lte|lt)\b/g,
      (match) => `$${match}`
    );
    filterObj = JSON.parse(filterObj);
    this.mongooseQuery.find(filterObj);
    return this;
  }

  //   Sorting
  sort() {
    if (this.queryString.sort) {
      //3shan lw 3ayz a3ml kza sort m3a b3d, http://localhost:3000/api/v1/products?sort=price,-sold
      let sortedBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery.sort(sortedBy);
    }
    return this;
  }

  //   Search
  search() {
    if (this.queryString.keyword) {
      this.mongooseQuery.find({
        $or: [
          {
            name: { $regex: this.queryString.keyword, $options: "i" },
          },
          {
            description: { $regex: this.queryString.keyword, $options: "i" },
          },
        ],
      });
    }
    return this;
  }

  //   Select Fields
  fields() {
    if (this.queryString.fields) {
      //3shan lw 3ayz a3ml kza fields m3a b3d, http://localhost:3000/api/v1/products?fields=price,-sold
      let fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery.select(fields);
    }
    return this;
  }
}
