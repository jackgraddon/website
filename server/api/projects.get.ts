export default defineEventHandler(async (event) => {
  // Pass 'event' as the first argument to target the server collection
  return await queryCollection(event, 'projects').all()
})