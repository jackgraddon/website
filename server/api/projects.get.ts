export default defineEventHandler(async (event) => {
  // Pass 'event' as the first argument
  return await queryCollection(event, 'projects').all()
})