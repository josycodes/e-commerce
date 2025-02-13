export default class UtilsService {

  static paginate(query, result ) {
    return {
      limit: query.limit, total: result.total, page: query.page,
      pages: Math.ceil(Number(result.total) / Number(query.limit))
    }
  }
}