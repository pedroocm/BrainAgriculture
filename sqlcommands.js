const aux = require('./auxiliar.js')

module.exports = {
    selectionar_todos: 
        `select cpf_ou_cnpj, nome_produtor, nome_fazenda, area_total, area_agricultavel, area_vegetacao,
         culturas, (localizacao).cidade as cidade, (localizacao).estado as estado
         from produtor_rural inner join fazenda on cpf_ou_cnpj = id_dono`,

    selecionar_id: function(id) {
                return `select cpf_ou_cnpj, nome_produtor, nome_fazenda, area_total, area_agricultavel,
                        area_vegetacao,culturas, (localizacao).cidade as cidade, (localizacao).estado as estado
                        from produtor_rural inner join fazenda on cpf_ou_cnpj = id_dono
                        where cpf_ou_cnpj = '${aux.check_cpf_cnpj(id)}'`
    },

    cadastrar: function(cadastro) {
                return `SELECT public.cadastrar_produtor (
                        '${aux.check_cpf_cnpj(cadastro.cpf_ou_cnpj)}', '${cadastro.nome_produtor}',
                        '${cadastro.nome_fazenda}', '${cadastro.area_total}',
                        '${cadastro.area_agricultavel}', '${cadastro.area_vegetacao}',
                        array [${aux.parse_culturas_to_string(cadastro.culturas)}]::text[],
                        '${cadastro.cidade}', '${cadastro.estado}')`
    },

    editar_id: function(update) {
        return `SELECT public.editar_produtor (
            '${aux.check_cpf_cnpj(update.cpf_ou_cnpj)}', '${update.nome_produtor}',
            '${update.nome_fazenda}', '${update.area_total}',
            '${update.area_agricultavel}', '${update.area_vegetacao}',
            array [${aux.parse_culturas_to_string(update.culturas)}]::text[],
            '${update.cidade}', '${update.estado}')`
    },

    editar_atributo_produtor: function (atributo, body) {
        if (atributo == 'cpf_ou_cnpj')
            body.novo_valor = aux.check_cpf_cnpj(body.novo_valor)
        return `UPDATE produtor_rural
                SET ${atributo} = '${body.novo_valor}'
                WHERE cpf_ou_cnpj = '${aux.check_cpf_cnpj(body.cpf_ou_cnpj)}'`
    },

    editar_atributo_fazenda: function (atributo, body) {
        if (atributo == 'culturas')
            body.novo_valor = `array[${aux.parse_culturas_to_string(body.novo_valor)}]::cultura[]`
        else
            body.novo_valor = `'${body.novo_valor}'`
        return `UPDATE fazenda
                SET ${atributo} = ${body.novo_valor}
                WHERE id_dono = '${aux.check_cpf_cnpj(body.cpf_ou_cnpj)}'`
    },

    excluir: function(id) {
        return `delete from produtor_rural
                where cpf_ou_cnpj = '${aux.check_cpf_cnpj(id)}'`
    },

    total_fazendas: `select coalesce(count(*)) as total from fazenda`,

    area_total_fazendas: `select coalesce(sum(area_total)) as area_total_fazendas from fazenda`,

    total_por_estado: `select (localizacao).estado, count(*) as total
                       from produtor_rural group by (localizacao).estado`,

    total_por_cultura: `select cultura, count(*) as total
                        from (select unnest(culturas) as cultura from fazenda) as foo group by cultura`,

    uso_de_solo: `select sum(area_total) as area_total, sum(area_agricultavel) as area_agricultavel,
                  sum(area_vegetacao) as area_vegetacao from fazenda`
}