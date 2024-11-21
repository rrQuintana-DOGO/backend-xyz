import { Catch, ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const rpcError = exception.getError();

    if (rpcError instanceof Error && rpcError.message.includes('Empty response')) {
      return response.status(503).json({
        status: 503,
        message: 'El microservicio no está disponible en este momento. Por favor, inténtelo de nuevo más tarde.',
      });
    }
    
    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      return response.status(rpcError.status).json(rpcError);
    }

    return response.status(400).json({
      status: 400,
      message: rpcError,
    });
  }
}

@Catch(HttpException)
export class HttpCustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    let { message } = errorResponse as { message: string; } 

    if(message === 'Unexpected field') {
      message = 'La petición contiene campos de más o no permitidos';
    }

    return response.status(status).json({message, status});
  }
}