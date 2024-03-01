class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryString = queryStr;
  }

  //   1) Search

  search() {
    const keyWord = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i",
          },
        }
      : {};

    // bhai this.querystring.desc ya kuch random daal rha h too. filter m excluded field array m daal dio
    // const description = this.queryString.desc // ye desc ya kuch aur niche excluded fields m
    //   ? {
    //       description: {
    //         $regex: this.queryString.desc,
    //         $options: "i",
    //       },
    //     }
    //   : {};

    // search for number/price in this case. BUt we use filter for price. ye bs example h

    // const priceQuery = this.queryString.price
    //   ? {
    //       price: {
    //         $gte: +this.queryString.price, // price ya number k lia gte, lte ye wale use krege. regex nhi regex sirf string k lia
    //       },
    //     }
    //   : {};
    // console.log(priceQuery);

    this.query = this.query.find({ ...keyWord });
    return this;
  }

  //   2) Filter
  filter() {
    const queryCopy = { ...this.queryString };
    //// removing fields
    const excludedFields = ["page", "keyword", "limit"];
    excludedFields.forEach((key) => delete queryCopy[key]);

    // advance filter for price range,ratings greater etc

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // 3) pagination

  paginate(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
