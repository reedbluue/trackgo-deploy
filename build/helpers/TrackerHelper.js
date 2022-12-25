import { rastrearEncomendas } from 'correios-brasil';
export class TrackerHelper {
    static async returnFrom(codes) {
        const res = await rastrearEncomendas(codes);
        return res.map((track) => {
            if (!track.eventos)
                return {
                    code: track.codObjeto,
                };
            return {
                code: track.codObjeto,
                type: track.tipoPostal.categoria,
                status: track.eventos
                    .map((status) => {
                    if (status.unidadeDestino) {
                        return {
                            code: status.codigo,
                            description: status.descricao,
                            dateTime: new Date(status.dtHrCriado),
                            unity: {
                                city: status.unidade.endereco.cidade,
                                state: status.unidade.endereco.uf,
                                type: status.unidade.tipo,
                            },
                            destiny: {
                                city: status.unidadeDestino.endereco.cidade,
                                state: status.unidadeDestino.endereco.uf,
                                type: status.unidadeDestino.tipo,
                            },
                        };
                    }
                    else {
                        return {
                            code: status.codigo,
                            description: status.descricao,
                            dateTime: new Date(status.dtHrCriado),
                            unity: {
                                city: status.unidade.endereco.cidade,
                                state: status.unidade.endereco.uf,
                                type: status.unidade.tipo,
                            },
                        };
                    }
                })
                    .reverse(),
            };
        });
    }
}
