export default function catchError(res, error) {
    console.error(error)
    res.status(500).send('Erro inesperado')
}