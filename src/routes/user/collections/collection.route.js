//Get All Collections
import {router} from "../../../middleware/app.middleware.js";
import {getAll} from "../../../controllers/user/collections/collection.controller.js";
import {authorizeRequest} from "../../../middleware/authentication.middleware.js";

router.use(authorizeRequest);

router.get('/all', getAll);

export default router;