import { PrismaService } from '@/prisma/prisma.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import { TProjectId, TProjectIds } from '@/types';
import { Injectable } from '@nestjs/common';
import { Prisma, UiDefinition, UiDefinitionContext } from '@prisma/client';

@Injectable()
export class UiDefinitionRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.UiDefinitionCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.UiDefinitionCreateArgs>,
    projectId?: TProjectId,
  ): Promise<UiDefinition> {
    return await this.prisma.uiDefinition.create<T>(this.scopeService.scopeCreate(args, projectId));
  }

  async findById<T extends Omit<Prisma.UiDefinitionFindFirstOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.UiDefinitionFindFirstOrThrowArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<UiDefinition> {
    return await this.prisma.uiDefinition.findFirstOrThrow(
      this.scopeService.scopeFindFirst(
        {
          where: { id },
          ...args,
        },
        projectIds,
      ),
    );
  }

  async findByWorkflowDefinitionId<
    T extends Omit<Prisma.UiDefinitionFindFirstOrThrowArgs, 'where'>,
  >(
    workflowDefinitionId: string,
    uiContext: keyof typeof UiDefinitionContext,
    args: Prisma.SelectSubset<T, Omit<Prisma.UiDefinitionFindFirstOrThrowArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<UiDefinition> {
    return await this.prisma.uiDefinition.findFirstOrThrow(
      this.scopeService.scopeFindFirst(
        {
          where: { workflowDefinitionId, uiContext: uiContext },
          ...args,
        },
        projectIds,
      ),
    );
  }

  async updateById<T extends Omit<Prisma.UiDefinitionUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.UiDefinitionUpdateArgs, 'where'>>,
    projectId: TProjectId,
  ): Promise<UiDefinition> {
    return await this.prisma.uiDefinition.update(
      this.scopeService.scopeUpdate(
        {
          where: { id },
          ...args,
        },
        projectId,
      ),
    );
  }

  async deleteById<T extends Omit<Prisma.UiDefinitionDeleteArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.UiDefinitionDeleteArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<UiDefinition> {
    return await this.prisma.uiDefinition.delete(
      this.scopeService.scopeDelete(
        {
          where: { id },
          ...args,
        },
        projectIds,
      ),
    );
  }
}
